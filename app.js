const vm = new Vue({
  el: "#app",
  data: {
    products: [],
    product: false,
    carrinho: [],
    carrinhoAtivo: false,
    mensagemAlerta: "Item adicionado",
    alertaAtivo: false,
  },
  filters: {
    numeroPreco(valor) {
      return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }
  },
  computed: {
    carrinhoTotal() {
      let total = 0;
      if (this.carrinho.length) {
        this.carrinho.forEach(item => {
          total += item.price;
        })
      }
      return total;
    }
  },
  methods: {
    fetchProdutos() {
      fetch("./api/produtos.json")
        .then(r => r.json())
        .then(r => {
          this.products = r;
        })
    },
    fetchProduto(id) {
      fetch(`./api/produtos/${id}/dados.json`)
        .then(r => r.json())
        .then(r => {
          this.product = r;
        })
    },
    openModal(id) {
      this.fetchProduto(id);
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      })
    },
    fecharModal({ target, currentTarget }) {
      if (target === currentTarget) this.product = false;
    },
    clickForaCarrinho({ target, currentTarget }) {
      if (target === currentTarget) this.carrinhoAtivo = false;
    },
    adicionarItem() {
      this.product.stock--;
      const { id, title, price } = this.product;
      this.carrinho.push({ id, title, price });
      this.alert(`${title} adicionado ao carrinho.`);
    },
    removerItem(index) {
      this.carrinho.splice(index, 1);
    },
    checarLocalStorage() {
      if (window.localStorage.carrinho)
        this.carrinho = JSON.parse(window.localStorage.carrinho);
    },
    compararEstoque() {
      const items = this.carrinho.filter(({ id }) => id === this.product.id);
      this.product.stock -= items.length;
    },
    alert(mensagem) {
      this.mensagemAlerta = mensagem;
      this.alertaAtivo = true;
      setTimeout(() => {
        this.alertaAtivo = false;
      }, 1500);
    },
    router() {
      const hash = document.location.hash;
      if (hash)
        this.fetchProduto(hash.replace("#", ""));
    }
  },
  watch: {
    product() {
      document.title = this.product.title || "Celinha Store";
      const hash = this.product.id || "";
      history.pushState(null, null, `#${hash}`);
      if (this.product) {
        this.compararEstoque();
      }
    },
    carrinho() {
      window.localStorage.carrinho = JSON.stringify(this.carrinho);
    }
  },
  created() {
    this.fetchProdutos();
    this.router();
    this.checarLocalStorage();
  }
})