<template>
  <iframe :src="src" :height="height" frameborder="0" width="100%" />
</template>
<script>
export default {
  name: 'PDF',
  data() {
    return {
      baseSrc: this.$route.query.src,
      pdfSrc: '/static/pdf/web/viewer.html?file=',
      wordSrc: 'https://view.officeapps.live.com/op/view.aspx?src=',
      src: '',
      height: document.body.clientHeight - 34 - 58
    }
  },
  created() {
    const pdfRegex = /\.pdf$/i
    const canUploadPdf = pdfRegex.test(this.baseSrc)
    this.src = (canUploadPdf ? this.pdfSrc : this.wordSrc + window.location.origin) + this.baseSrc
  }
}
</script>
