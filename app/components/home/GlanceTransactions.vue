<script setup lang="ts"></script>

<template>
<div class="h-full flex grow overflow-hidden relative">
  <div class="relative h-full flex flex-col grow overflow-hidden items-stretch">
    <div class="flex flex-col flex-1 basis-auto overflow-hidden">
      <div class="flex-1 basis-auto overflow-auto sm:px-12">
        <div class="flex flex-col gap-0.5">
          <TransactionItem id="1" date="30/11/2025" type="Fast Payment Receipt" description="" :withdrawal="null" :deposit="13" />
          <TransactionItem id="2" date="30/11/2025" type="Fast Payment Receipt" description="" :withdrawal="null" :deposit="13" />
          <TransactionItem id="3" date="01/12/2025" type="Debit Card Transaction" description="" :withdrawal="8.6" :deposit="null" />
          <TransactionItem id="4" date="30/11/2025" type="Fast Payment Receipt" description="" :withdrawal="null" :deposit="13" />
          <TransactionItem id="5" date="30/11/2025" type="Fast Payment Receipt" description="" :withdrawal="null" :deposit="13" />
          <TransactionItem id="6" date="01/12/2025" type="Debit Card Transaction" description="" :withdrawal="8.6" :deposit="null" />
          <TransactionItem id="7" date="30/11/2025" type="Fast Payment Receipt" description="" :withdrawal="null" :deposit="13" />
          <TransactionItem id="8" date="30/11/2025" type="Fast Payment Receipt" description="" :withdrawal="null" :deposit="13" />
          <TransactionItem id="9" date="30/11/2025" type="Fast Payment Receipt" description="" :withdrawal="null" :deposit="13" />
          <TransactionItem id="10" date="01/12/2025" type="Debit Card Transaction" description="" :withdrawal="8.6" :deposit="null" />
          <TransactionItem id="11" date="30/11/2025" type="Fast Payment Receipt" description="" :withdrawal="null" :deposit="13" />
          <TransactionItem id="12" date="01/12/2025" type="Debit Card Transaction" description="" :withdrawal="8.6" :deposit="null" />
          <TransactionItem id="13" date="01/12/2025" type="Debit Card Transaction" description="" :withdrawal="8.6" :deposit="null" />
          <TransactionItem id="14" date="30/11/2025" type="Fast Payment Receipt" description="" :withdrawal="null" :deposit="13" />
          <TransactionItem id="15" date="30/11/2025" type="Fast Payment Receipt" description="" :withdrawal="null" :deposit="13" />
          <TransactionItem id="16" date="01/12/2025" type="Debit Card Transaction" description="" :withdrawal="8.6" :deposit="null" />
        </div>
      </div>
    </div>
  </div>
</div>
<!-- <div class="w-full h-full flex flex-col shrink">
</div> -->
</template>
