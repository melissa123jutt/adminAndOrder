let orders = [];
let currentOrderIndex = 0;
let totalCommission = 0;
let totalAmount = 0;
let accessGranted = false;
let depositAmount = 0;
let submittedOrders = 0;
let earnedMoney = 0;

document.addEventListener('DOMContentLoaded', () => {
    // Initialize fake orders
    for (let i = 1; i <= 20; i++) {
        const price = (Math.random() * 100).toFixed(2);
        const quantity = Math.floor(Math.random() * 10) + 1;
        const orderAmount = (price * quantity).toFixed(2);
        const commissions = (orderAmount * 0.04).toFixed(2);

        orders.push({
            id: i,
            product: "Sample Product " + i,
            price: price,
            quantity: quantity,
            orderAmount: orderAmount,
            commissions: commissions,
        });
    }

    // Fetch deposit amount and access status from local storage
    depositAmount = parseFloat(localStorage.getItem('depositAmount')) || 0;
    accessGranted = JSON.parse(localStorage.getItem('accessGranted') || 'false');

    // Update deposit amount on the page
    document.getElementById('account-balance').innerText = depositAmount.toFixed(2) + ' USDT';

    // Update deposited money and total commission
    updateBalanceInfo();
});

function updateBalanceInfo() {
    document.getElementById('deposited-money').innerText = depositAmount.toFixed(2) + ' USDT';
    document.getElementById('total-commission').innerText = totalCommission.toFixed(2) + ' USDT';
    document.getElementById('submitted-orders').innerText = submittedOrders;
    document.getElementById('earned-money').innerText = earnedMoney.toFixed(2) + ' USDT';
    document.getElementById('order-submitted').innerText = submittedOrders;
    document.getElementById('money-earned').innerText = earnedMoney.toFixed(2) + ' USDT';
}

function setDepositAmount() {
    const amount = parseFloat(document.getElementById('deposit-amount').value);
    if (isNaN(amount) || amount < 0) {
        alert('Please enter a valid amount');
        return;
    }

    localStorage.setItem('depositAmount', amount.toFixed(2));
    alert('Deposit amount set to ' + amount.toFixed(2) + ' USDT');
    depositAmount = amount;
    document.getElementById('account-balance').innerText = depositAmount.toFixed(2) + ' USDT';
    updateBalanceInfo();
}

function grantAccess() {
    localStorage.setItem('accessGranted', 'true');
    alert('Access granted');
    accessGranted = true;
}

function revokeAccess() {
    localStorage.setItem('accessGranted', 'false');
    alert('Access revoked');
    accessGranted = false;
}

function increaseAccountBalance() {
    const amount = parseFloat(document.getElementById('increase-amount').value);
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount to increase');
        return;
    }

    depositAmount += amount;
    localStorage.setItem('depositAmount', depositAmount.toFixed(2));
    document.getElementById('account-balance').innerText = depositAmount.toFixed(2) + ' USDT';
    updateBalanceInfo();
    alert(`Account balance increased by ${amount.toFixed(2)} USDT`);
}

function grabOrder() {
    if (!accessGranted) {
        alert('Please grant access first!');
        return;
    }

    if (currentOrderIndex < orders.length) {
        const order = orders[currentOrderIndex];
        const imageLink = prompt("Please enter the product image link:", "https://m.media-amazon.com/images/I/31OHfbE2W-L._AC_UL320_.jpg");
        const description = prompt("Please enter the product description:", order.product);

        document.getElementById('order-product').innerText = order.product;
        document.getElementById('order-price').innerText = order.price;
        document.getElementById('order-quantity').innerText = order.quantity;
        document.getElementById('order-amount').innerText = order.orderAmount;
        document.getElementById('order-commission').innerText = order.commissions;

        $('#orderModal').modal('show');
        document.getElementById('modal-order-number').innerText = order.id;
        document.getElementById('modal-product-image').src = imageLink ? imageLink : "https://m.media-amazon.com/images/I/31OHfbE2W-L._AC_UL320_.jpg";
        document.getElementById('modal-product-description').innerText = description;
        document.getElementById('modal-transaction-time').innerText = new Date().toLocaleString();
        document.getElementById('modal-order-amount').innerText = order.orderAmount;
        document.getElementById('modal-commissions').innerText = order.commissions;
        document.getElementById('modal-expected-income').innerText = (parseFloat(order.orderAmount) + parseFloat(order.commissions)).toFixed(2);
    } else {
        alert('No more orders to grab!');
    }
}

function submitOrder() {
    if (currentOrderIndex < orders.length) {
        const order = orders[currentOrderIndex];
        const orderAmount = parseFloat(order.orderAmount);

        if (orderAmount > depositAmount) {
            document.getElementById('notification-message').innerText = `Insufficient balance. Please deposit at least ${orderAmount.toFixed(2)} USDT to submit this order.`;
            document.getElementById('notification').style.display = 'block';
            return;
        }

        currentOrderIndex++;
        totalCommission += parseFloat(order.commissions);
        totalAmount += orderAmount;
        depositAmount -= orderAmount;

        submittedOrders++;
        earnedMoney += parseFloat(order.orderAmount) + parseFloat(order.commissions);

        document.getElementById('account-balance').innerText = depositAmount.toFixed(2) + ' USDT';
        updateBalanceInfo();

        document.getElementById('order-container').classList.remove('show');
        document.getElementById('notification').style.display = 'none';
    } else {
        alert('No more orders to submit!');
    }
}

function finalizeOrder() {
    submitOrder();
    $('#orderModal').modal('hide');
}

function resetProgram() {
    // Clear localStorage
    localStorage.removeItem('depositAmount');
    localStorage.removeItem('accessGranted');

    // Reset variables
    currentOrderIndex = 0;
    totalCommission = 0;
    totalAmount = 0;
    accessGranted = false;
    depositAmount = 0;
    submittedOrders = 0;
    earnedMoney = 0;

    // Update UI
    document.getElementById('account-balance').innerText = depositAmount.toFixed(2) + ' USDT';
    document.getElementById('submitted-orders').innerText = '0';
    document.getElementById('earned-money').innerText = '0.00 USDT';
    document.getElementById('order-submitted').innerText = '0';
    document.getElementById('money-earned').innerText = '0.00 USDT';
    document.getElementById('notification').style.display = 'none';
    document.getElementById('order-container').classList.remove('show');
    updateBalanceInfo();

    alert('Program reset successful');
}
