// Define character trigrams and names
var TRIGS = [
    'ALX', 'BLR', 'BRD', 'BSN', 'CMY', 'CNL', 'DSM',
    'FAN', 'GUL', 'IBK', 'JRI', 'KEN', 'KRN', 'LAR',
    'NCL', 'NSH', 'RMK', 'RSD', 'RYU', 'URN', 'VEG',
    'Z20', 'Z21', 'Z22', 'Z23', 'Z24', 'Z25', 'ZGF'
];
var NAMES = [
    'ALEX', 'CLAW', 'BIRDIE', 'BOXER', 'CAMMY', 'CHUN-LI', 'DHALSIM',
    'FANG', 'GUILE', 'IBUKI', 'JURI', 'KEN', 'KARIN', 'LAURA',
    'NECALLI','NASH', 'R. MIKA', 'RASHID', 'RYU', 'URIEN', 'DICTATOR',
    'KOLIN', 'AKUMA', 'ED', 'MENAT', 'ABIGAIL', 'ZEKU', 'ZANGIEF'
];

var charsDiv = d3.select("#CHARS");
var charsLabelText = " Select a character: ";

// set character based on hash, if it exists
var HASHCHAR;

var HASH = window.location.hash.substr(1).split("/"); //gets hash, starting after "#" and splitting on "/" characters
if (HASH.length >= 1){ // if hash contains character
    if (TRIGS.indexOf(HASH[0]) !== -1)
        // character exists
        HASHCHAR = HASH[0]
}

function init() {

    // Show character selection
    showCharSel();
    makeTableBase();
    loadData();
}

function showCharSel() {
    charsDiv.append("p").attr("id", "chars-label").text(charsLabelText);

    var dropdown = charsDiv.select("p").append("select")
        .attr("class", "dropdown")
        .on("change", onChangeChar);

    dropdown.selectAll("option")
        .data(NAMES).enter().append("option")
        .text(function (d) { return d; });

    var indexOfChar = TRIGS.indexOf(HASHCHAR);
    if (HASHCHAR && indexOfChar !== -1) {
        dropdown.property("value", NAMES[indexOfChar]); // set the dropdown to the value in the hash
    } else {
        HASHCHAR = "ALX";
    }
}

function onChangeChar() {
    // set current char to selected value
      // convert name to trigram
    var selectedChar = d3.select("select").property("value"); // gets the selected character name
      // set hash to selected character's trigram
    HASHCHAR = TRIGS[NAMES.indexOf(selectedChar)];
    window.location.hash = "#" + HASHCHAR + "/";

    // load data for the selected character
    loadData();
}

function makeTableBase() {
    d3.select("#TABLE").append("thead").classed("tbl-header", true);
    d3.select("#TABLE").append("tbody").classed("tbl-body", true);

    if (d3.select(".tbl-header").select("#header-row").empty())
        d3.select(".tbl-header")
            .append('tr').attr("id", "header-row");
}

function loadData() {
    /**
     @param data The json form of the database.
     @param data.objects[] The tables in the database.
     @param data.objects[].name The table name.
     @param data.objects[].columns[] The columns of the table.
     @param data.objects[].columns[].name Name of the column.
     @param data.objects[].rows[] The rows of the table.
     */
    d3.json("js/sql-mmdiff-export.json", function (data){
        console.log("type is " + data.type);

        for (var i in data.objects) {
            var tbl = data.objects[i];

            if (tbl.name === HASHCHAR)
            {
                console.log("table name: " + tbl.name);
                //show the character's data

                // select
                d3.select("#header-row").selectAll("th")
                    .data(tbl.columns).enter()
                    .append("th")
                    .text( function (columns) { return columns.name; } );
                console.log(d3.select("#header-row"));

                d3.select(".tbl-body").selectAll("tr").remove();

                d3.select(".tbl-body").selectAll("tr")
                    .data(tbl.rows).enter()
                    .append("tr")
                    .selectAll('td')
                    .data(function (row, i) {
                        //data(row[i]).enter().append("td");
                        console.log("row: " + row + ", i: " + i);
                        return (row)
                    }).enter().append("td").text(function (d){return d;});

                break;
            }
        }
    });

}

init();
