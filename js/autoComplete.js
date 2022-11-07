// The autoComplete.js Engine instance creator
const data = [];
let filteredResults = [];
let raffle = "";
const autoCompleteJS = new autoComplete({
  data: {
    src: async () => {
      try {
        // Loading placeholder text
        document
          .getElementById("autoComplete")
          .setAttribute("placeholder", "Loading...");
        // Fetch External Data Source
        const source = await fetch("./static/gameIdList.txt").then((response) =>
          response.text()
        );
        const raffleList = source.split(/\n/).filter(Boolean);
        const temp = [];
        for (const raffle of raffleList) {
          const splittedText = raffle.split("--");
          const response = await fetch(
            `./static/txs/${splittedText[0]}/finalizeTx.txt`
          );
          const finalizeTXFileData =
            response && response.ok ? await response.text() : null;
          if (finalizeTXFileData) {
          }
          temp.push({
            id: splittedText[0],
            startDate: splittedText[1] || "",
            endDate: splittedText[2] || "",
            name: splittedText.slice(3).join("--") || "",
          });
        }
        console.log("temp", temp);
        for (let i = temp.length - 1; i >= 0; i--) {
          data.push(temp[i]);
        }
        // const data = await source.json();
        // Post Loading placeholder text
        document
          .getElementById("autoComplete")
          .setAttribute("placeholder", autoCompleteJS.placeHolder);
        // Returns Fetched data
        return data;
      } catch (error) {
        return error;
      }
    },
    keys: ["name"],
    cache: true,
    filter: (list) => {
      // Filter duplicates

      filteredResults = Array.from(list.map((value) => value.match)).map(
        (item) => {
          return list.find((value) => value.match === item);
        }
      );

      return filteredResults;
    },
  },
  placeHolder: "Search Game",
  resultsList: {
    maxResults: 10,
    destination: "#autoComplete",
  },
  resultItem: {
    element: (item, data) => {
      // Modify Results Item Style
      item.style = "display: flex; justify-content: space-between;";
      // Modify Results Item Content
      if (data.value.startDate && data.value.endDate)
        item.innerHTML = `
      <span style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
       <img src="./images/search.svg" width="15px"> ${data.match} (${data.value.startDate} to ${data.value.endDate})
      </span>`;
      else
        item.innerHTML = `
      <span style="text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
       <img src="./images/search.svg" width="15px"> ${data.match}
      </span>`;
    },
    highlight: true,
  },
  events: {
    input: {
      focus() {
        raffle = document.getElementById("autoComplete");
        if (raffle.value === "") autoCompleteJS.start("  ");
        else autoCompleteJS.start();
      },
      selection(event) {
        const feedback = event.detail;
        const raffleId = feedback.selection.value["id"];
        autoCompleteJS.input.blur();
        handleValidate(raffleId);
        // Prepare User's Selected Value
        const selection = feedback.selection.value[feedback.selection.key];
        document.getElementById("raffleTitle").innerHTML = selection;
        // Replace Input value with the selected value
        autoCompleteJS.input.value = selection;
      },
    },
  },
});
