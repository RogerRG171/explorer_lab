import "./css/index.css"

import IMask from "imask"

//DOM
const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")
const cvc = document.querySelector("#security-code")
const expirationDate = document.querySelector("#expiration-date")
const cardHolder = document.querySelector("#card-holder")
const cardNumber = document.querySelector("#card-number")

// Function to change color cc by type
function setCardType(type) {
  const colors = {
    visa: ["#2d57f2", "#432d69"],
    mastercard: ["#C69347", "#DF6F29"],
    "american-express": ["#1f6733", "#00A607"],
    default: ["black", "gray"],
  }

  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

const cvcPattern = {
  mask: "0000",
}

const cvcMasked = IMask(cvc, cvcPattern)

const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
    YY: {
      mask: IMask.MaskedRange,
      from: Number(String(new Date().getFullYear()).slice(2, 4)),
      to: Number(String(new Date().getFullYear()).slice(2, 4)) + 10,
    },
  },
}

const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      cardType: "visa",
      regex: /^4\d{0,15}/,
    },
    {
      mask: "0000 0000 0000 0000",
      cardType: "mastercard",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d{0,1}|^2[3-7]\d{0,2})\d{0,12}/,
    },
    {
      mask: "0000 000000 00000",
      cardType: "american-express",
      regex: /^3[47]\d{0,15}/,
    },
    {
      mask: "0000 0000 0000 0000",
      cardType: "default",
    },
  ],
  dispatch: function (appended, dynamicMasked) {
    var number = (dynamicMasked.value + appended).replace(/\D/g, "")
    var foundMask = dynamicMasked.compiledMasks.find(function (item) {
      return number.match(item.regex)
    })

    return foundMask
  },
}

const cardNumberMasked = IMask(cardNumber, cardNumberPattern)
console.log(cardNumberMasked)

globalThis.setCardType = setCardType
