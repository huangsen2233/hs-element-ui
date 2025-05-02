<template>
  <h2>通过 slot 传入内容</h2>
  <div style="max-width: 600px">
    <hs-alert type="success">Success alert</hs-alert>
    <hs-alert type="info">Info alert</hs-alert>
    <hs-alert type="warning">Warning alert</hs-alert>
    <hs-alert type="danger">Error alert</hs-alert>
  </div>
  <h2>通过 prop 传入内容</h2>
  <div style="max-width: 600px">
    <hs-alert type="success" title="Success alert" />
    <hs-alert type="info" title="Info alert" />
    <hs-alert type="warning" title="Warning alert" />
    <hs-alert type="danger" title="Error alert" />
  </div>
</template>
