let tableBody = document.querySelector("tbody");
let tableRows = tableBody.querySelectorAll("tr");

let scoreRows = [];
let scoreSections = [];

const updateAverage = () => {
  for (section of scoreSections) {
    let sum = 0;
    let totalRows = 0;
    for (row of section.children) {
      if (row.type == "score" && row.checkButton.checked) {
        sum += row.score;
        totalRows++;
      }
    }
    if (totalRows != 0) {
      section.average = Math.round(100 * (sum / totalRows)) / 100;
      section.headRow.firstElementChild.innerHTML =
        section.name + ` | Average: ${section.average}%`;
    } else {
      section.headRow.firstElementChild.innerHTML = `${section.name} | (no scores)`;
    }
  }
};

const barClassName = "progress bg";
for (tr of tableRows) {
  const barElement = tr.lastElementChild.firstElementChild;

  let hasScore = false;
  if (barElement != null && barElement.className == barClassName) {
    var firstChild = barElement.firstElementChild;
    var secondChild = barElement.lastElementChild;

    if (firstChild.innerHTML != "") {
      let text = firstChild.innerHTML;
      var score = parseInt(text.substring(0, text.length - 1));
    } else {
      let text = secondChild.innerHTML;
      var score = parseInt(text.substring(0, text.length - 1));
    }
    hasScore = true;
  }

  const sectionNameIdentifier = "TH";
  const isHead = tr.firstElementChild.tagName == sectionNameIdentifier;
  let typeName = "";
  if (isHead) {
    typeName = "head";
  } else if (hasScore) {
    typeName = "score";
  } else {
    typeName = "useless";
  }

  let button = document.createElement("input");
  button.type = "checkbox";
  button.defaultChecked = true;
  button.onchange = updateAverage;

  scoreRows.push({
    ancestorRow: tr,
    type: typeName,
    checkButton: typeName == "score" ? button : undefined,
    section: undefined,
    score: score,
  });
}

// Adds row object's button to every relevant tr element
for (row of scoreRows) {
  if (row.type == "score") {
    let buttonCell = document.createElement("td");
    buttonCell.appendChild(row.checkButton);
    row.ancestorRow.appendChild(buttonCell);
  }
}

// Assigns section to each row object in scoreRows
let currentElement = scoreRows[scoreRows.length - 1].ancestorRow;
let currentSection = [];
const sectionNameIdentifier = "TH";

// Starts with the last row and goes upwards in the table, assgining section heads
for (row of scoreRows.slice().reverse()) {
  if (row.type == "head") {
    scoreSections.push({
      headRow: row.ancestorRow,
      name: row.ancestorRow.firstElementChild.innerHTML,
      children: currentSection,
    });
    currentSection = [];
  }
  if (row.type != "head") {
    currentSection.push(row);
  }
}

updateAverage();
