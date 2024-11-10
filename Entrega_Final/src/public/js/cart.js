const cartId='672f853f971f2f0e6523b56f'

document.addEventListener('DOMContentLoaded', () => {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.getAttribute('id');
           deleteProduct(productId);
        });
    })
});

function deleteProduct(id) {
    fetch(`/api/carts/${cartId}/products/${id}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        location.reload();
        console.log(data)
    })
    }
        
