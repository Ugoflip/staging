const S3BucketBaseUrl = "https://ugoflipstore.s3.amazonaws.com/";
async function handleValidate(raffleId) {
  addLoading();
  const bsv = window.bsvjs;
  const pubKey = bsv.PubKey.fromString(
    "0250234c855965c3de27d1a7f1917ed89f6f05301b690e2f5bfed8c4a303339a84"
  );

  const initializeTxFileData = await readFile(`${raffleId}/initTx.txt`);
  const initializeTxId = initializeTxFileData.split(/\n/)[0];
  const finalizeTXFileData = await readFile(`${raffleId}/finalizeTx.txt`);
  if (!finalizeTXFileData) {
    errorMessage("Game result have not been announced yet.", "info");
    removeLoading();
    return;
  }
  const finalizeTXId = finalizeTXFileData.split(/\n/)[0];
  if (initializeTxId) {
    const initializationTx = await readTxBufferFromS3File(
      `${initializeTxId}.btx`
    );
    const finalizationTx = await readTxBufferFromS3File(`${finalizeTXId}.btx`);
    let ticketIds = await readFile(`${raffleId}/ticketIds.txt`);
    ticketIds = ticketIds.split(/\n/).filter(Boolean);
    selectWinners(
      initializationTx,
      finalizationTx,
      async (count) => {
        if (count < ticketIds.length) {
          const nextRecord = await readTxBufferFromS3File(
            `${ticketIds[count]}.btx`
          );
          return nextRecord;
        }
      },
      pubKey
    );
  }
}

function stringToRegex(str) {
  // Main regex
  const main = str.match(/\/(.+)\/.*/)[1];

  // Regex options
  const options = str.match(/\/.+\/(.*)/)[1];

  // Compiled regex
  return new RegExp(main, options);
}
function backFunction() {
  document.getElementById("search").style.display = "block";
  document.getElementById("winner").style.display = "none";
  document.getElementById("back").style.display = "none";
}
function showWinnerInfo(winnerInfoList) {
  document.getElementById("search").style.display = "none";
  document.getElementById("winner").style.display = "block";
  document.getElementById("back").style.display = "block";
  const winnerInfoElement = document.getElementById("winnerInfo");
  if (winnerInfoList && winnerInfoList.length) {
    let data = "";
    for (const winnerInfo of winnerInfoList) {
      if (winnerInfo.winningTicketIds.length) {
        data += `<tr><td><img src="images/win.png" /> ${
          winnerInfo.reward.rewardTitle
        }</td><td><img src="images/coin.png" /> ${
          winnerInfo.percentageWon < 100
            ? `won ${winnerInfo.percentageWon}% of`
            : ""
        } ${winnerInfo.reward.rewardPrice}
        </td><td>${winnerInfo.winningTicketIds.join("<br />")}</td></tr>`;
      }
    }
    winnerInfoElement.innerHTML = data;
  } else {
    winnerInfoElement.innerHTML =
      "<tr><td colspan='3'>No Data Found. Please try to different search.</td></tr>";
  }
}

function addLoading() {
  document.getElementById("loading").style.display = "flex";
  document.getElementById("bar").style.width = "0%";
  progress();
}

function removeLoading() {
  document.getElementById("loading").style.display = "none";
  document.getElementById("bar").style.width = "0%";
  document.getElementById("autoComplete").value = "";
}
function errorMessage(message, icon = "error") {
  swal({
    icon: icon,
    // title: "Oops...",
    text: message,
  });
}
async function readTxBufferFromS3File(fileName) {
  const response = await fetch(`${S3BucketBaseUrl}${fileName}`);
  const tx = await response.arrayBuffer();
  const buf = Buffer.alloc(tx.byteLength);

  const view = new Uint8Array(tx);
  for (let i = 0; i < buf.length; ++i) {
    buf[i] = view[i];
  }
  return buf;
}
function validateGameSelect() {
  const raffle = document.getElementById("autoComplete");

  if (raffle.value === "") {
    errorMessage("Please search any game");
    return;
  }
  if (filteredResults.length === 0) {
    errorMessage(
      "No match result found. Please try to search different keyword"
    );
    return;
  }

  autoCompleteJS.open();
}

async function readFile(fileName) {
  const response = await fetch(`./static/txs/${fileName}`);
  return response && response.ok ? await response.text() : null;
}

async function loadNextTransaction(ticketId) {
  const transactionResponse = await readTxBufferFromS3File(`${ticketId}.btx`);
  return transactionResponse;
}
