const compose = (...fns) =>
    fns.reduce((f, g) => (...args) => f(g(...args)));

const formatPrice = value => {
    // check số thập phân và lấy 2 số cuối của phần thập phân
    debugger
    return (Math.ceil(value) === value ? value : value.toFixed(2))
    .toString()
    .split(".")
    .map((element, idx, arr) =>
        // check phần nguyên của số để đẩy xuống dưới điều kiện tiếp theo
        idx + 1 !== arr.length || arr.length === 1
        ?
        element
        .split("")
        .map((char, i, a) => 
            // check đk, nếu char chia hết cho 3 sẽ thêm dấu phẩy sau char và char cuối sẽ không thêm dấu phẩy
            i < a.length - 1 && !((a.length - i - 1) % 3) ? char + "," : char
        )
        .join("") 
        :
        element
    )
    .join(".");
}

const safeFormatPrice = (price) =>
    isNaN(price) ? "-" : formatPrice(price);

const response = [{
        code: "USD",
        name: "Dollar Mỹ",
        sell: 23160
    },
    {
        code: "HKD",
        name: "Dollar Hồng Kông",
        sell: 3008
    },
    {
        code: "JPY",
        name: "Yên Nhật",
        sell: 217.23
    },
    {
        code: "THB",
        name: "Baht Thái Lan",
        sell: 764.33
    },
    {
        code: "RUB",
        name: "Rub Nga",
        sell: 322.32
    },
];

const calculateConvertedMoney = (money, rate) =>
    !isNaN(money) && !isNaN(rate) && money > 0 ? money * rate : NaN;

const displayConvertedMoney = (money, rate) => {
    const value = calculateConvertedMoney(money, rate);
    const spanDOM = document.getElementById("converted-money");
    if (!spanDOM) return;
    spanDOM.innerText = value ?
        `= ${safeFormatPrice(value)} VNĐ` :
        "Có lỗi xảy ra";
};

const onCalculateMoney = () => {
    const selectDOM = document.getElementById("currencies");
    const inputDOM = document.getElementById("money-inp");
    if (!inputDOM || !selectDOM) return;
    displayConvertedMoney(selectDOM.value, inputDOM.value);
};

const createNewDataDom = (data) => {
    let tableData = document.createElement("td");
    tableData.innerText = data;
    return tableData;
};

const setDataToCurrencyTable = () => {
    const tableBodyDoms = document.getElementsByTagName("tbody");
    if (!tableBodyDoms.length || !response) return;
    const tableBody = tableBodyDoms[0];
    response.forEach((element) => {
        const tableRow = document.createElement("tr");
        const {
            code,
            name,
            sell
        } = element;
        const appendValueToRow = (node) => tableRow.append(node);
        compose(appendValueToRow, createNewDataDom)(code);
        compose(appendValueToRow, createNewDataDom)(name);
        compose(appendValueToRow, createNewDataDom, safeFormatPrice)(sell);

        tableBody.append(tableRow);
    });
};

const setCurrencyOptions = () => {
    const selectDOM = document.getElementById("currencies");
    const inputDOM = document.getElementById("money-inp");
    const spanDOM = document.getElementById("converted-money");
    if (!selectDOM || !response.length || !selectDOM || !spanDOM) return;
    const appendSelectOption = (node) => selectDOM.append(node);
    const createNewDataDom = (data) => {
        const {
            code,
            name,
            sell
        } = data;
        let optionDOM = document.createElement("option");
        optionDOM.value = sell;
        optionDOM.innerText = code;
        return optionDOM;
    };
    response.forEach((element) => {
        compose(appendSelectOption, createNewDataDom)(element);
    });
};
setDataToCurrencyTable();
setCurrencyOptions();
onCalculateMoney();