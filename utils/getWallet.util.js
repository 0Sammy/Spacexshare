
function getWallet(coin) {
    switch (coin.toLowerCase()) {
        case "bitcoin": return "bc1qzl4ryny09hja4p5nz9v26pcgnqtux63mrapr45";
        case "ethereum": return "0xD3fe264a1D8017DfBeA9499DB9Fb22a3106485AD";
        case "usdt": return "0xD3fe264a1D8017DfBeA9499DB9Fb22a3106485AD";
        case "dogecoin": return "DREBZME23eHTvKb7N5PdqxN9U3NvLMhSWW";
        case "shibainu": return "0xD3fe264a1D8017DfBeA9499DB9Fb22a3106485AD";
        case "maga": return "0xD3fe264a1D8017DfBeA9499DB9Fb22a3106485AD";
        case "solana": return "F8C9fi8HfKNQTvCcUgfWUayxr2zVs1atrDbe8dizVgeE";
        default: return "you did not select a deposit method";
    }

}

module.exports = getWallet;
