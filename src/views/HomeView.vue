<template>
  <EmailList :emails="emails" />
</template>

<script>
import EmailList from '@/components/EmailList.vue';
import axios from 'axios';

export default {
  name: "HomeView",
  components: {
    EmailList,
  },
  data() {
    return {
      emails: []
    };
  },
  created() {
    axios.get('http://localhost:3000/emails')
      .then(response => {
        this.emails = response.data;
      })
      .catch(error => {
        console.error("Fehler beim Laden der Emails:", error);
      });
  }
};
</script>