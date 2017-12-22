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
     @param data The json from the Python output.
     @param data.stats Character stats (HP and STUN)
     @param data.stats.HP
     @param data.stats.STUN
     @param data.moves[] The character's list of moves and their frame data.
     */
    d3.json("js/jsons/"+HASHCHAR+"_moves.json", function (data) {
        var stat_values = [];
        var i = 0;

        data.stats = data["Stats"];

        while(i < data.stats.length)
        {
            stat_values.append(data.stats[i]);
            i++;
        }

        var char_HP = data.stats.HP;
        var char_STUN = data.stats.STUN;

        data.moves = data["Moves"];
        var columns = d3.keys(data.moves[0]);

        // add header row
        d3.select("#header-row").selectAll("th")
            .data(columns).enter()
            .append("th")
            .text(function(key){ return key; });
        console.log(d3.select("#header-row"));

        console.log(char_HP + ", " + char_STUN);

        d3.select(".tbl-body").selectAll("tr").remove();

        d3.select(".tbl-body").selectAll("tr")
            .data(data.moves).enter()
            .append("tr") // creates a row for each item in data.moves[]
            .selectAll("td")
            .data(function (row_datum) {
                // handling one row (row_datum) ((of columns))
                return (columns).map(function (col_datum) {
                    // handling one column (col) ((in the row))
                    return {colname: col_datum, value: row_datum[col_datum]};
                });
            }).enter()
            .append("td")
            .text(function (d) { return d.value; });
    });

}

init();
