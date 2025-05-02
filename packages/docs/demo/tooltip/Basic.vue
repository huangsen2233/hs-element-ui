<template>
  <div class="tooltip-base-box">
    <div class="row center">
      <hs-tooltip
        class="box-item"
        content="Top Left prompts info"
        placement="top-start"
      >
        <hs-button>top-start</hs-button>
      </hs-tooltip>
      <hs-tooltip
        class="box-item"
        content="Top Center prompts info"
        placement="top"
      >
        <hs-button>top</hs-button>
      </hs-tooltip>
      <hs-tooltip
        class="box-item"
        content="Top Right prompts info"
        placement="top-end"
      >
        <hs-button>top-end</hs-button>
      </hs-tooltip>
    </div>
    <div class="row">
      <hs-tooltip
        class="box-item"
        content="Left Top prompts info"
        placement="left-start"
      >
        <hs-button>left-start</hs-button>
      </hs-tooltip>
      <hs-tooltip
        class="box-item"
        content="Right Top prompts info"
        placement="right-start"
      >
        <hs-button>right-start</hs-button>
      </hs-tooltip>
    </div>
    <div class="row">
      <hs-tooltip
        class="box-item"
        content="Left Center prompts info"
        placement="left"
      >
        <hs-button class="mt-3 mb-3">left</hs-button>
      </hs-tooltip>
      <hs-tooltip
        class="box-item"
        content="Right Center prompts info"
        placement="right"
      >
        <hs-button>right</hs-button>
      </hs-tooltip>
    </div>
    <div class="row">
      <hs-tooltip
        class="box-item"
        content="Left Bottom prompts info"
        placement="left-end"
      >
        <hs-button>left-end</hs-button>
      </hs-tooltip>
      <hs-tooltip
        class="box-item"
        content="Right Bottom prompts info"
        placement="right-end"
      >
        <hs-button>right-end</hs-button>
      </hs-tooltip>
    </div>
    <div class="row center">
      <hs-tooltip
        class="box-item"
        content="Bottom Left prompts info"
        placement="bottom-start"
      >
        <hs-button>bottom-start</hs-button>
      </hs-tooltip>
      <hs-tooltip
        class="box-item"
        content="Bottom Center prompts info"
        placement="bottom"
      >
        <hs-button>bottom</hs-button>
      </hs-tooltip>
      <hs-tooltip
        class="box-item"
        content="Bottom Right prompts info"
        placement="bottom-end"
      >
        <hs-button>bottom-end</hs-button>
      </hs-tooltip>
    </div>
  </div>
</template>

<style>
.tooltip-base-box {
  width: 600px;
}
.tooltip-base-box .row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.tooltip-base-box .center {
  justify-content: center;
}
.tooltip-base-box .box-item {
  width: 110px;
  margin-top: 10px;
}
</style>
