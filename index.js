const URL_API = "https://api.escuelajs.co/api/v1/products"

const cardsContainerHTML = document.querySelector(".cards-container")
const searchInputHTML = document.querySelector("#searchInput")


class CartManager {
    constructor(){
        this.cart = []
    }
    saveCart = () =>{
        localStorage.setItem("cart", JSON.stringify(this.cart))
    }
    getLocalCart = () =>{
        const obteinedCart = JSON.parse(localStorage.getItem("cart"))
        if(obteinedCart){
            this.cart = obteinedCart
        }else{
            localStorage.setItem("cart", JSON.stringify(this.cart))
        }
    }
    addToCart = (productToAdd) =>{
        if(this.cart.some(product => Number(product.id) === Number(productToAdd.id))){
            this.cart.forEach(product => {
                if(Number(product.id) === Number(productToAdd.id)){
                    product.quantity++
                }
            })
        }else{
            this.cart.push({...productToAdd, quantity: 1})
        }
        this.saveCart()
    }
}

class ProductsManager {
    constructor(){
        this.products = []
        this.productsToRender = []
    }

    addProduct = (product) =>{
        this.products.push(product)
        this.productsToRender.push(product)
    }
    getProducts = () => this.products
    renderProducts = () =>{
        if(this.productsToRender.length < 1){
            cardsContainerHTML.innerHTML = `<h2>Cargando...</h2>`
        }else{
            cardsContainerHTML.innerHTML = ""
            this.productsToRender.forEach((product) => {
                cardsContainerHTML.innerHTML += `
                <div class="card">
                    <h3>${product.title}</h3>
                    <img src=${product.images[0]} class="card-img">
                    <div class="card-info-container">
                        <p>Price: $${product.price} </p>
                        <span class="card-category">${product.category.name}</span>
                    </div>
                    <button class="btn card-btn-add" id="btn-buy-${product.id}">Add</button>
                </div>
                `
            })
            const btnBuyListHTML = document.getElementsByClassName("card-btn-add")
            for(const btn of btnBuyListHTML){
                btn.addEventListener("click", () =>{
                    cartManager.addToCart(
                        this.products.find(product => product.id === Number(btn.id.split("-").pop()))
                        )
                    Toastify({
                        text: "Se añadio un producto al carrito",
                        duration: 3000,
                        style: {
                            background: "rgb(98, 192, 98)"
                        }
                        }).showToast();
                })
            }
        }
    }
    filterProducts = (value) =>{
        this.productsToRender = this.products.filter(product => product.title.toLowerCase().includes(value.toLowerCase()))
        this.renderProducts()
    }
}

const productsManager = new ProductsManager()
const cartManager = new CartManager()
cartManager.getLocalCart()
productsManager.renderProducts()

fetch(URL_API)
.then(res => res.json())
.then(data => {
    data.forEach(product =>{
        productsManager.addProduct(product)
    })
    productsManager.renderProducts()
})


searchInputHTML.addEventListener("change", () =>{
    productsManager.filterProducts(searchInputHTML.value)
})