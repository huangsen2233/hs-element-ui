<template>
  <div>
    <hs-button type="primary" loading>Loading</hs-button>
    <hs-button type="primary" loading-icon="circle-notch" loading
      >Loading</hs-button
    >
    <hs-button type="primary" loading>
      <template #loading>
        <hs-icon style="margin-right: 6px" icon="star" spin />
      </template>
      Loading
    </hs-button>
  </div>
</template>
