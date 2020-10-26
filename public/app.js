const app = new Vue({
  el: "#app",
  data: {
    url: "",
    slug: "",
    flag: "main",
    mainUrl: "http://localhost:3000",
    created: null,
    list: [{ url: "url", slug: "slug" }],
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
      this.created = await response.json()
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
