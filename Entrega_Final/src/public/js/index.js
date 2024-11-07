document.addEventListener('DOMContentLoaded', function () {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.getAttribute('id');
            console.log(productId);
            deleteProduct(productId);
        });
    });
    // const products = document.querySelectorAll('.card');
    // products.forEach(product => {
    //     product.addEventListener('click', function () {
    //         const productId = this.getAttribute('data-product-id');
    //         console.log(product);
    //         //console.log(window.location.href +` ${productId}`);
    //     });
    // })
});


// Función para eliminar un producto
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
            const productElement = document.querySelector(`[data-product-id="${productId}"]`);
            productElement.remove();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un problema al eliminar el producto.');
        });
    }
}

