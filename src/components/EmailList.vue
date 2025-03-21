<template>
  <div>
    <h1>Email Liste</h1>
    <ul>
      <li v-for="email in emails" :key="email.seqno">
        {{ email.header['subject'] ? email.header['subject'][0] : 'Kein Betreff' }}
      </li>
    </ul>
  </div>
</template>

<script setup>
defineProps({
  emails: {
    type: Array,
    required: true,
  },
})
</script>
