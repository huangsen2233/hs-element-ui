import type { LoadingOptions, LoadingOptionsResolved  } from './types';
import { isString, isNil, delay, defer } from 'lodash-es';
import { useZIndex } from '@hs-element-ui/hooks';
import { reactive, ref, nextTick, createApp } from 'vue';
import LoadingComponent from './Loading.vue';

const RELATIVE_CLASS = 'er-loading-parent--relative' as const;
const HIDEN_CLASS = 'er-loading-parent--hiden' as const;
const LOADING_NUMB_KEY = 'er-loading-numb' as const;

const instanceMap: Map<HTMLElement, LoadingInstance> = new Map();
const { nextZIndex } = useZIndex(3000);


function addRelativeClass(target: HTMLElement) {
  target.classList.add(RELATIVE_CLASS);
}

function removeRelativeClass(target: HTMLElement) {
  target.classList.remove(RELATIVE_CLASS);
}

function addHidenClass(target: HTMLElement) {
  target.classList.add(HIDEN_CLASS);
}
function removeHidenClass(target: HTMLElement) {
  target.classList.remove(HIDEN_CLASS);
}

function addClass(opts: LoadingOptions, target: HTMLElement = document.body) {
  if (opts.lock) {
    addHidenClass(target);
  } else {
    removeHidenClass(target);
  }
  addRelativeClass(target);
}

// 获取loading数量，loading函数可被多次调用
function getLoadingNumb(target: HTMLElement = document.body) {
  return target.getAttribute(LOADING_NUMB_KEY);
}

// loading被同一个元素调用，只会存在一个loading实例
function removeLoadingNumb(target: HTMLElement = document.body) {
  target.removeAttribute(LOADING_NUMB_KEY);
}

function addLoadingNumb(target: HTMLElement = document.body) {
  const numb = getLoadingNumb(target) ?? '0';
  target.setAttribute(LOADING_NUMB_KEY, `${Number.parseInt(numb) + 1}`);
}

function subLoadingNumb(target: HTMLElement = document.body) {
  const numb = getLoadingNumb(target);
  if (numb) {
    const newNumb = Number.parseInt(numb) - 1;
    if (newNumb === 0) {
      removeLoadingNumb(target);
    } else {
      target.setAttribute(LOADING_NUMB_KEY, `${newNumb}`);
    }
  } else {
    target.removeAttribute(LOADING_NUMB_KEY);
  }
}


function createLoading(opts: LoadingOptionsResolved) {
  const visible = ref(opts.visible);
  const afterLeaveFlag = ref(false);
  const handleAfterLeave = () => {
    if (!afterLeaveFlag.value) {
      return;
    }
    destroy()
  };

  const data = reactive({
    ...opts,
    onAfterLeave: handleAfterLeave,
  });
  const setText = (text: string) => {
    data.text = text;
  }

  const app = createApp(LoadingComponent, {
    ...data,
    zIndex: data.fullscreen ? nextZIndex() : void 0,
    visible,
  });
  const vm = app.mount(document.createElement('div'));

  const destroy = () => {
    const target = data.parent;
    subLoadingNumb(target);
    if (getLoadingNumb(target)) return
    delay(() => {
      removeRelativeClass(target!);
      removeHidenClass(target!);
    }, 1)
    instanceMap.delete(target ?? document.body);
    vm.$el?.parentNode?.removeChild(vm.$el);
    app.unmount();
  };
  let afterLeaveTimer: number;
  const close = () => {
    if (opts.beforeClose && !opts.beforeClose()) return;
    afterLeaveFlag.value = true;
    clearTimeout(afterLeaveTimer);
    // defer：延迟执行函数
    afterLeaveTimer = defer(handleAfterLeave);
    visible.value = false;
    opts.closed?.();
  }

  return {
    get $el(): HTMLElement {
      return vm.$el as HTMLElement;
    },
    vm,
    close,
    visible,
    setText,
  }
}

// 注意：可以全局调用loading函数，也可以指令式调用loading

// 处理 options
function resolveOptions(opts: LoadingOptions): LoadingOptionsResolved {
  let target: HTMLElement;
  // options中的target的类型 string | HTMLElement

  if (isString(opts.target)) {
    target = document.querySelector(opts.target) ?? document.body;
  } else {
    target = opts.target || document.body;
  }
  return {
    parent: target === document.body || opts.body ? document.body : target,
    background: opts.background || 'rgba(0, 0, 0, 0.5)',
    spinner: opts.spinner,
    text: opts.text,
    fullscreen: target === document.body && (opts.fullscreen || true),
    lock: opts.lock ?? false,
    visible: opts.visible ?? true,
    target: target,
  }
}

let fullscreenInstance: LoadingInstance | null = null;

export type LoadingInstance = ReturnType<typeof createLoading>
export function Loading(options: LoadingOptions): LoadingInstance {
  const resolved = resolveOptions(options);
  const target = resolved.parent ?? document.body;
  if (resolved.fullscreen && !isNil(fullscreenInstance)) {
    return fullscreenInstance;
  }

  addLoadingNumb(resolved?.parent);
  if (instanceMap.has(target)) {
    return instanceMap.get(target)!;
  }

  const instance = createLoading({
    ...resolved,
    closed: () => {
      resolved.closed?.();
      if (resolved.fullscreen) {
        fullscreenInstance = null;
      }
    }
  });
  addClass(options, resolved?.parent);
  resolved.parent?.appendChild(instance.$el);
  nextTick(() => {
    instance.visible.value = !!resolved.visible;
  });
  if (resolved.fullscreen) {
    fullscreenInstance = instance;
  }
  instanceMap.set(target, instance);
  return instance;
}

