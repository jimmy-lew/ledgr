<script setup lang="ts"></script>

<template>
<div class="w-full flex flex-col mt-8 gap-2">
  <h3 class="px-6 text-muted">Recent transactions</h3>
  <div class="flex flex-col gap-2 px-3">
    <TransactionItem date="30/11/2025" type="ADVICE_FAST_PAYMENT_RECEIPT" description="" :withdrawal="null" :deposit="13" />
    <TransactionItem date="30/11/2025" type="ADVICE_FAST_PAYMENT_RECEIPT" description="" :withdrawal="null" :deposit="13" />
    <TransactionItem date="01/12/2025" type="DEBIT_CARD_TRANSACTION" description="" :withdrawal="8.6" :deposit="null" />
    <TransactionItem date="30/11/2025" type="ADVICE_FAST_PAYMENT_RECEIPT" description="" :withdrawal="null" :deposit="13" />
    <TransactionItem date="30/11/2025" type="ADVICE_FAST_PAYMENT_RECEIPT" description="" :withdrawal="null" :deposit="13" />
    <TransactionItem date="30/11/2025" type="ADVICE_FAST_PAYMENT_RECEIPT" description="" :withdrawal="null" :deposit="13" />
    <TransactionItem date="30/11/2025" type="ADVICE_FAST_PAYMENT_RECEIPT" description="" :withdrawal="null" :deposit="13" />
    <TransactionItem date="30/11/2025" type="ADVICE_FAST_PAYMENT_RECEIPT" description="" :withdrawal="null" :deposit="13" />
  </div>
</div>
</template>
