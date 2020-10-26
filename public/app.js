const app = new Vue({
  el: "#app",
  data: {
    url: "",
    slug: "",
    mainUrl: "https://short-short-url.herokuapp.com/",
    list: [],
  },
  async mounted() {
    const response = await fetch("/list", {
      method: "get",
      headers: {
        "content-type": "application/json",
      },
    })
    this.list = await response.json()
  },
  methods: {
    async createUrl() {
      const response = await fetch("/url", {
        method: "post",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          url: this.url,
          slug: this.slug,
        }),
      })
      window.location.href = this.mainUrl
    },
    refresh() {
      this.url = ""
      this.slug = ""
      this.created = ""
    },
    async deleteUrl(slug) {
      const response = await fetch("/delete", {
        method: "delete",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          slug: slug,
        }),
      })
      window.location.href = this.mainUrl
    },
  },
})
