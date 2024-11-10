const cartId='672f853f971f2f0e6523b56f'

document.addEventListener('DOMContentLoaded',  
    () => {
         buttons()
        
});
let sort='default';
let limit=10;
let page=1;
let hasprev=false;
let hasnext=true;
let totalpages=10;

const filter=document.getElementById('filter');
const nextpage=document.getElementById('nextPage');
const prevpage=document.getElementById('prevPage');
const pagecount=document.getElementById('pageCount');

filter.addEventListener('click', filterProducts);

nextpage.addEventListener('click', () => {
     page<totalpages?page++:page; 
     getProducts();
     console.log(totalpages)
    prevpage.hidden=false;
    hasprev=true;
    if(page==totalpages){
        hasnext=false;
        nextpage.hidden=true;
    }
    pagecount.textContent=page;    
});

prevpage.addEventListener('click', () => {
    page--; 
    nextpage.hidden=false;
    hasnext=true;
    if(page==1){
        hasprev=false;
        prevpage.hidden=true;
    }
    pagecount.textContent=page;    
    getProducts();
});



function filterProducts() {
    limit=document.getElementById('limit').value;
    sort=document.getElementById('sort').value;
    page=1;
    nextpage.hidden=false;
    hasnext=true;
    if(page==1){
        hasprev=false;
        prevpage.hidden=true;
    }
    pagecount.textContent=page;   
    getProducts();
}

function deleteProduct(productId) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        fetch(`/api/products/${productId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al eliminar el producto');
            }
            return response.json();
        })
        .then(data => {
            alert('Producto eliminado con éxito');
            // Elimina el producto del DOM
            eliminaproductodelrender(productId);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un problema al eliminar el producto.');
        });
    }
}


function editProduct(id){
    fetch(`/api/products/${id}`, {
        method: 'GET',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener datos  del producto');
        }
       
        return response.json();
    })
    .then(product =>{
        console.table(product)
        loadProductData(product)
    })

}

function loadProductData(product) {
    document.getElementById('productId').value = product._id;
    document.getElementById('title').value = product.title;
    document.getElementById('description').value = product.description;
    document.getElementById('code').value = product.code;
    document.getElementById('price').value = product.price;
    document.getElementById('status').checked = product.status;
    document.getElementById('stock').value = product.stock;
    document.getElementById('category').value = product.category;
    document.getElementById('thumbnails').value = product.thumbnails.join(',');

    document.getElementById('title').focus()
}



async function submitForm() {
    const productId = document.getElementById('productId').value;
    const method = productId ? 'PUT' : 'POST';
    const url = productId ? `/api/products/${productId}` : '/api/products';

    const productData = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        code: document.getElementById('code').value,
        price: parseFloat(document.getElementById('price').value),
        status: document.getElementById('status').checked,
        stock: parseInt(document.getElementById('stock').value),
        category: document.getElementById('category').value,
        thumbnails: document.getElementById('thumbnails').value.split(',')
    };

    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }

        const result = await response.json();
        alert(`Producto ${method === 'POST' ? 'creado' : 'actualizado'} con éxito`);
        document.getElementById('productForm').reset();
    } catch (error) {
        alert('Error al guardar el producto: ' + error.message);
    }
 
 
    getProducts();
}

function eliminaproductodelrender(productId){
    const productElement = document.querySelector(`[data-product-id="${productId}"]`);
    productElement.remove();
}


function renderProduct(product) {
    const productElement = document.createElement('div');
    productElement.classList.add('col-md-4', 'mb-4');
    productElement.setAttribute('data-product-id', product._id);
    productElement.innerHTML = `
                <div class="card h-100 shadow-sm" data-product-id="${product._id}">                   
                                         <img src="./default.jpg" alt=${product.title} class="card-img-top" >
                      
                    <div class="card-body">
                        <h2 class="card-title h5">${product.title}</h2>
                        <p class="text-muted"><strong>ID:</strong>${product._id}</p>
                        <p><strong>Descripción:</strong>${product.description}</p>
                        <p><strong>Código:</strong> ${product.code}</p>
                        <p><strong>Precio:</strong> ${product.price}</p>
                        <p><strong>Status:</strong> 
                           ${product.status ?
                                '<span class="badge badge-success">Disponible</span>'
                            :
                               '<span class="badge badge-danger">No Disponible</span>'
                           }
                        </p>
                        <p><strong>Stock:</strong> ${product.stock}</p>
                        <p><strong>Categoría:</strong> ${product.category}</p>
                        <p><a class="link" href=product/${product._id}>ver mas</a></p>
                    </div>
                    <div class="card-footer text-center">
                        <button class="btn btn-danger btn-sm mt-2 delete-btn" id="${product._id}" >Eliminar</button>
                        <button class="btn btn-primary btn-sm mt-2 edit-btn" id="${product._id}">Editar</button>
                    </div>
                </div>            
    `;

    return productElement;
}   

function getProducts() {
    fetch(`/api/products?limit=${limit}&page=${page}${sort!= 'default' ? `&sort=price:${sort}` : ''}`)
        .then(response => response.json())
        .then(data => {
            const productContainer = document.getElementById('products');
            productContainer.classList.add('row', 'row-cols-1', 'row-cols-md-3', 'g-4');
            productContainer.innerHTML = '';
            data.docs.forEach(product => {
                const productElement = renderProduct(product);
                productContainer.appendChild(productElement);
            hasnext=data.hasnext
            hasprev=data.hasprev
            page=data.page
            totalpages=data.totalPages
            if(page==totalpages){
                hasnext=false;
                nextpage.hidden=true;
            }
            
            });
            buttons();
        })
        .catch(error => console.error('Error al obtener los productos:', error));
}


function buttons() {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.getAttribute('id');
            console.log(productId);
            deleteProduct(productId);
        });
    });
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.getAttribute('id');
            console.log(productId);
            editProduct(productId);
        });

    });
    const buybuttons = document.querySelectorAll('.buy-btn');
    buybuttons.forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.getAttribute('id');
            console.log(productId);
           addToCart(productId);
        });
    });

}

function addToCart(productId) {
    fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('Producto agregado al carrito:', data);
        })
        .catch(error => console.error('Error al agregar el producto al carrito:', error));
}