// Number to Words Utility (Indian System)
function numberToWords(num) {
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    function inWords(n) {
        if (n < 20) return a[n];
        let s = b[Math.floor(n / 10)];
        if (n % 10 > 0) s += ' ' + a[n % 10];
        return s;
    }

    if (num === 0) return 'Zero';

    let n = Math.floor(num);
    let p = Math.round((num - n) * 100);

    let res = 'INR ';

    if (n >= 10000000) {
        res += inWords(Math.floor(n / 10000000)) + 'Crore ';
        n %= 10000000;
    }
    if (n >= 100000) {
        res += inWords(Math.floor(n / 100000)) + 'Lakh ';
        n %= 100000;
    }
    if (n >= 1000) {
        res += inWords(Math.floor(n / 1000)) + 'Thousand ';
        n %= 1000;
    }
    if (n >= 100) {
        res += inWords(Math.floor(n / 100)) + 'Hundred ';
        n %= 100;
    }
    if (n > 0) {
        if (res !== 'INR ') res += 'and ';
        res += inWords(n);
    }

    res += 'Only';

    if (p > 0) {
        res = res.replace(' Only', '');
        res += ' and ' + inWords(p) + 'paise Only';
    }

    return res.trim();
}

// State Management
let invoiceData = {
    company: {
        name: "FROST AIR SERVICES",
        address: "6, Akashdeep Bldg., Near French Bridge, Opera House, Mumbai – 400007",
        gst: "27BNEPS4838L1ZC",
        pan: "BNEPS4838L",
        state: "Maharashtra, Code: 27",
        contact: "9322248933/8779859463",
        email: "frostair36@gmail.com"
    },
    invoice: {
        no: "FAS/468",
        date: "2024-05-23"
    },
    buyer: {
        name: "Ramdas Upadyay",
        address: "17, Aristocrat Building, Nr. Yoga Institute, Prabhat Colony, Santacruz East. Mumbai-400029.",
        state: "Maharashtra"
    },
    items: [
        { desc: "DAIKIN 1.5 TON 3 STAR INVERTER SAC\nMODEL-FTKC48", hsn: "8415", qty: 1, rate: 30084.75, per: "nos." }
    ],
    bank: {
        name: "BANK OF INDIA",
        acc: "000220110000431",
        ifsc: "BKID0000002",
        branch: "Andheri West"
    }
};

// DOM Elements
const itemsList = document.getElementById('itemsList');
const addItemBtn = document.getElementById('addItemBtn');
const printBtn = document.getElementById('printBtn');

// Initial Sync
function init() {
    renderItemsEditor();
    updatePreview();
    attachListeners();
}

function attachListeners() {
    // Company Listeners
    document.getElementById('compName').addEventListener('input', e => { invoiceData.company.name = e.target.value; updatePreview(); });
    document.getElementById('compAddr').addEventListener('input', e => { invoiceData.company.address = e.target.value; updatePreview(); });
    document.getElementById('compGST').addEventListener('input', e => { invoiceData.company.gst = e.target.value; updatePreview(); });
    document.getElementById('compPAN').addEventListener('input', e => { invoiceData.company.pan = e.target.value; updatePreview(); });
    document.getElementById('compState').addEventListener('input', e => { invoiceData.company.state = e.target.value; updatePreview(); });
    document.getElementById('compContact').addEventListener('input', e => { invoiceData.company.contact = e.target.value; updatePreview(); });
    document.getElementById('compEmail').addEventListener('input', e => { invoiceData.company.email = e.target.value; updatePreview(); });

    // Invoice Listeners
    document.getElementById('invNo').addEventListener('input', e => { invoiceData.invoice.no = e.target.value; updatePreview(); });
    document.getElementById('invDate').addEventListener('input', e => { invoiceData.invoice.date = e.target.value; updatePreview(); });

    // Buyer Listeners
    document.getElementById('buyerName').addEventListener('input', e => { invoiceData.buyer.name = e.target.value; updatePreview(); });
    document.getElementById('buyerAddr').addEventListener('input', e => { invoiceData.buyer.address = e.target.value; updatePreview(); });
    document.getElementById('buyerState').addEventListener('input', e => { invoiceData.buyer.state = e.target.value; updatePreview(); });

    // Bank Listeners
    document.getElementById('bankName').addEventListener('input', e => { invoiceData.bank.name = e.target.value; updatePreview(); });
    document.getElementById('bankAcc').addEventListener('input', e => { invoiceData.bank.acc = e.target.value; updatePreview(); });
    document.getElementById('bankIFSC').addEventListener('input', e => { invoiceData.bank.ifsc = e.target.value; updatePreview(); });
    document.getElementById('bankBranch').addEventListener('input', e => { invoiceData.bank.branch = e.target.value; updatePreview(); });

    addItemBtn.addEventListener('click', () => {
        invoiceData.items.push({ desc: "", hsn: "", qty: 1, rate: 0, per: "nos." });
        renderItemsEditor();
        updatePreview();
    });

    const printActions = [document.getElementById('printBtnDesktop')];
    printActions.forEach(btn => {
        if (btn) btn.addEventListener('click', () => window.print());
    });
}

function renderItemsEditor() {
    itemsList.innerHTML = '';
    invoiceData.items.forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'item-row-edit';
        row.innerHTML = `
            <div class="item-row-header">
                <span>Row ${index + 1}</span>
                <i data-lucide="trash-2" class="remove-item" onclick="removeItem(${index})"></i>
            </div>
            <div class="field-group">
                <textarea placeholder="Description" oninput="updateItem(${index}, 'desc', this.value)">${item.desc}</textarea>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.5rem">
                    <input type="text" placeholder="HSN" value="${item.hsn}" oninput="updateItem(${index}, 'hsn', this.value)">
                    <input type="text" placeholder="per (e.g. nos.)" value="${item.per}" oninput="updateItem(${index}, 'per', this.value)">
                </div>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.5rem">
                    <input type="number" placeholder="Qty" value="${item.qty}" oninput="updateItem(${index}, 'qty', this.value)">
                    <input type="number" placeholder="Rate" value="${item.rate}" oninput="updateItem(${index}, 'rate', this.value)">
                </div>
            </div>
        `;
        itemsList.appendChild(row);
    });
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function updateItem(index, key, value) {
    if (key === 'qty' || key === 'rate') {
        invoiceData.items[index][key] = parseFloat(value) || 0;
    } else {
        invoiceData.items[index][key] = value;
    }
    updatePreview();
}

function removeItem(index) {
    invoiceData.items.splice(index, 1);
    renderItemsEditor();
    updatePreview();
}

function updatePreview() {
    const d = invoiceData;

    // Header & Info
    document.getElementById('viewCompName').textContent = d.company.name;
    document.getElementById('viewCompAddr').textContent = d.company.address;
    document.getElementById('viewCompGST').textContent = d.company.gst;
    document.getElementById('viewCompPAN').textContent = d.company.pan;
    document.getElementById('viewCompState').textContent = d.company.state;
    document.getElementById('viewCompContact').textContent = d.company.contact;
    document.getElementById('viewCompEmail').textContent = d.company.email;

    document.getElementById('viewInvNo').textContent = d.invoice.no;
    // Format date to DD/MM/YYYY
    const dateObj = new Date(d.invoice.date);
    const formattedDate = dateObj.toLocaleDateString('en-GB');
    document.getElementById('viewInvDate').textContent = formattedDate;

    document.getElementById('viewBuyerName').textContent = d.buyer.name;
    document.getElementById('viewBuyerAddr').textContent = d.buyer.address;
    document.getElementById('viewBuyerState').textContent = d.buyer.state;

    // Items
    const tbody = document.getElementById('viewItemsBody');
    tbody.innerHTML = '';
    let subtotal = 0;
    let totalQty = 0;

    d.items.forEach((item, i) => {
        const amount = item.qty * item.rate;
        subtotal += amount;
        totalQty += item.qty;

        const row = `
            <tr>
                <td>${i + 1}.</td>
                <td style="white-space: pre-wrap;"><strong>${item.desc.split('\n')[0]}</strong>\n${item.desc.split('\n').slice(1).join('\n')}</td>
                <td>${item.hsn}</td>
                <td style="text-align: right;">${item.qty.toFixed(2)}</td>
                <td style="text-align: right;">${item.rate.toFixed(2)}</td>
                <td>${item.per}</td>
                <td style="text-align: right;"><strong>${amount.toFixed(2)}</strong></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });

    // Padding empty rows to keep layout consistent
    const minRows = 8;
    for (let i = d.items.length; i < minRows; i++) {
        tbody.innerHTML += `<tr><td height="20"></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>`;
    }

    const cgst = subtotal * 0.09;
    const sgst = subtotal * 0.09;
    const total = subtotal + cgst + sgst;
    const grandTotal = Math.round(total);
    const roundOff = grandTotal - total;

    document.getElementById('viewSubtotal').textContent = subtotal.toFixed(2);
    document.getElementById('viewCGST').textContent = cgst.toFixed(2);
    document.getElementById('viewSGST').textContent = sgst.toFixed(2);
    document.getElementById('viewRoundOff').textContent = roundOff.toFixed(2);
    document.getElementById('viewTotalQty').textContent = totalQty.toFixed(2);
    document.getElementById('viewGrandTotal').textContent = grandTotal.toFixed(2);
    document.getElementById('viewGrandTotalWords').textContent = numberToWords(grandTotal);

    // Tax Table (Grouped by HSN)
    const taxBody = document.getElementById('viewTaxBody');
    taxBody.innerHTML = '';

    // Grouping logic (simplified since usually it's one HSN, but good to have)
    const hsnGroups = {};
    d.items.forEach(item => {
        if (!hsnGroups[item.hsn]) hsnGroups[item.hsn] = 0;
        hsnGroups[item.hsn] += (item.qty * item.rate);
    });

    let taxableTotal = 0;
    let totalCentralTax = 0;
    let totalStateTax = 0;

    Object.keys(hsnGroups).forEach(hsn => {
        const taxableVal = hsnGroups[hsn];
        const cTax = taxableVal * 0.09;
        const sTax = taxableVal * 0.09;
        const rowTaxTotal = cTax + sTax;

        taxableTotal += taxableVal;
        totalCentralTax += cTax;
        totalStateTax += sTax;

        taxBody.innerHTML += `
            <tr>
                <td>${hsn}</td>
                <td>${taxableVal.toFixed(2)}</td>
                <td>9.00%</td>
                <td>${cTax.toFixed(2)}</td>
                <td>9.00%</td>
                <td>${sTax.toFixed(2)}</td>
                <td>${rowTaxTotal.toFixed(2)}</td>
            </tr>
        `;
    });

    document.getElementById('viewTaxableTotal').textContent = taxableTotal.toFixed(2);
    document.getElementById('viewCentralTaxTotal').textContent = totalCentralTax.toFixed(2);
    document.getElementById('viewStateTaxTotal').textContent = totalStateTax.toFixed(2);
    document.getElementById('viewTaxTotal').textContent = (totalCentralTax + totalStateTax).toFixed(2);
    document.getElementById('viewTaxTotalWords').textContent = numberToWords(totalCentralTax + totalStateTax);

    // Bank
    document.getElementById('viewBankName').textContent = d.bank.name;
    document.getElementById('viewBankAcc').textContent = d.bank.acc;
    document.getElementById('viewBankIFSC').textContent = d.bank.ifsc;
    document.getElementById('viewBankBranch').textContent = d.bank.branch;
}

init();
