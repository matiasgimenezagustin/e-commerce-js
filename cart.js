const URL_API = "https://api.escuelajs.co/api/v1/products"

const btnCleanCartHTML = document.querySelector("#btnCleanCart")
const btnConfirmCartHTML = document.querySelector("#btnConfirmCart")
const cartContainerHTML = document.querySelector(".cart-cards-container")
const totalHTML = document.querySelector("#total")

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
    addToCart = (id) =>{
        if(this.cart.some(product => Number(product.id) === Number(id))){
            this.cart.forEach(product => {
                if(Number(product.id) === Number(id)){
                    product.quantity++
                }
            })
        }else{
            this.cart.push({id, quantity: 1})
        }
        this.saveCart()
    }
    add = (productToAdd) =>{
        this.cart.forEach(product =>{
            if(product.id === productToAdd.id){
                product.quantity++
            }
        })
        this.saveCart()
    } 
    less = (productToLess) =>{
        this.cart.forEach(product =>{
            if(product.id === productToLess.id){
                product.quantity === 1 ? product.quantity : product.quantity--
            }
        })
        this.saveCart()
    }
    delete = (productToDelete) =>{
        this.cart = this.cart.filter((product) => product.id !== Number(productToDelete.id))
        this.saveCart()
    }
    clean = () =>{
        this.cart = [] 
        this.saveCart()
    }
    renderCart = () =>{
        if(this.cart.length < 1 ){
            cartContainerHTML.innerHTML = "<h2>Aun no has comprado productos...</h2>"
        }else{
            cartContainerHTML.innerHTML = ""
            this.cart.forEach(product => {
                cartContainerHTML.innerHTML += `
                <div class="cart-card">
                    <div class="cart-card-info">
                        <h2>${product.title}</h2>
                        <p>Unit Price: $${product.price}</p>
                        <p>Units: ${product.quantity}</p>
                    </div>
                    <div class="cart-cards-btns-container">
                        <div >
                            <button class="btn btn-add-cart" id="btn-add-cart-${product.id}">+</button>
                            <p>${product.quantity}</p>
                            <button class="btn btn-less-cart" id="btn-less-cart-${product.id}">-</button>
                        </div>
                        <button class="btn btn-delete-cart" id="btn-delete-cart-${product.id}"><i class="bi bi-trash3-fill"></i></button>
                    </div>
                </div>
                `
        })
        }
        
        const btnsAdd = document.getElementsByClassName("btn-add-cart")
        const btnsDelete = document.getElementsByClassName("btn-delete-cart")
        const btnsLess = document.getElementsByClassName("btn btn-less-cart")
        for(const btn of btnsAdd){
            btn.addEventListener("click", () =>{
                cartManager.add(this.cart.find(product => Number(btn.id.split("-").pop()) === Number(product.id)))
                cartManager.renderCart()
            })
        }
        for(const btn of btnsLess){
            btn.addEventListener("click", () =>{
                cartManager.less(this.cart.find(product => Number(btn.id.split("-").pop()) === Number(product.id)) )
                cartManager.renderCart()
            })
        }
        for(const btn of btnsDelete){
            btn.addEventListener("click", () =>{
                cartManager.delete(this.cart.find(product => Number(btn.id.split("-").pop()) === Number(product.id)) )
                cartManager.renderCart()
            })
        }
        let total = 0
        this.cart.forEach(product => total += Number(product.price) * Number(product.quantity))
        totalHTML.innerHTML = `<h2>Total: $${total}</h2>`
    }
}

const cartManager = new CartManager()

btnCleanCartHTML.addEventListener("click",() => {
    cartManager.clean()
    Toastify({
        text: "Se limpio el carrtito",
        duration: 3000,
        style: {
            background: "rgb(98, 192, 98)"
        }
        }).showToast();
    cartManager.renderCart()
})
btnConfirmCartHTML.addEventListener("click", () => {
    if(cartManager.cart.length < 1){
        Toastify({
            text: "No tienes productos en tu carrito!",
            duration: 3000,
            style: {
                background: "rgb(225, 85, 85)"
            }
            }).showToast();
    }else{
        cartManager.clean()
        Toastify({
            text: "Se confirmo tu carrito",
            duration: 3000,
            style: {
                background: "rgb(98, 192, 98)"
            }
            }).showToast();
            cartManager.renderCart()
    }
    
})





cartManager.getLocalCart()
cartManager.renderCart()