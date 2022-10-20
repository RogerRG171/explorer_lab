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
const addButton = document.querySelector("#add-card")
const ccHolder = document.querySelector(".cc-holder .value")
const ccSecurity = document.querySelector(".cc-security .value")
const ccExpiration = document.querySelector(".cc-expiration .value")
const ccNumber = document.querySelector(".cc-info .cc-number")

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault()
})

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

addButton.addEventListener("click", () => {
  alert("cartão adicionado!")
})

const cardHolderPattern = {
  mask: /^[a-z\s]+$/,
}

const cardHolderMasked = IMask(cardHolder, cardHolderPattern)

cardHolder.addEventListener("input", () => {
  ccHolder.textContent = cardHolderMasked.value
  if (
    ccHolder.textContent === "" ||
    ccHolder.textContent.match(/^\s+$/) ||
    ccHolder.textContent.length === 0
  ) {
    ccHolder.textContent = "FULANO DA SILVA"
  }
})

cvcMasked.on("accept", () => {
  ccSecurity.textContent = cvcMasked.value.length === 0 ? 123 : cvcMasked.value
})

expirationDateMasked.on("accept", () => {
  ccExpiration.textContent =
    expirationDateMasked.value.length === 0
      ? "02/32"
      : expirationDateMasked.value
})

cardNumberMasked.on("accept", async () => {
  ccNumber.textContent =
    cardNumberMasked.value.length === 0
      ? "1234 5678 9012 3456"
      : cardNumberMasked.value

  setCardType(cardNumberMasked.masked.currentMask.cardType)
})

globalThis.setCardType = setCardType
