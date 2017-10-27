(function ($) {
    $.fn.shuffle = function () {
        return this.each(function () {
            var items = $(this).children().clone(true);
            return (items.length) ? $(this).html($.shuffle(items)) : this;
        });
    }
    $.shuffle = function (arr) {
        for (var j, x, i = arr.length; i; j = parseInt(Math.random() * i), x = arr[--i], arr[i] = arr[j], arr[j] = x);
        return arr;
    }
})(jQuery);

var randomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

var activeSection = "";
var shuffle = function (section) {
    activeSection = section;
    var hideUsedValues = $("#hide-used-values").prop("checked");
    var deleteUsedValues = $("#delete-used-values").prop("checked");
    var shuffleFirstColumn = $("#shuffle-first-column").prop("checked");
    var shuffleRows = $("#shuffle-row-order").prop("checked");
    $("#content div").hide();
    $("#" + section).remove();
    $("#" + section + "-original").clone().attr("id", section).appendTo("#content").show();
    var drags = $("#draggables");
    drags.html("");
    var a = [];
    var isShort = $("#" + section + " table").hasClass("short");
    $("#" + section + " td").removeClass("ui-state-highlight column-head").addClass("hidden-text");
    $("#" + section + " tr").removeClass("alt-row").each(function () {
        var skip = !shuffleFirstColumn;
        $(this).children("td").each(function () {
            if (skip) {
                skip = false;
                $(this).removeClass("hidden-text");
                $(this).addClass("column-head");
            } else {
                var t = $(this).text();
                var addIt = true;
                if (!hideUsedValues && !deleteUsedValues) {
                    for (var i = 0; i < a.length; i++) {
                        if (a[i].value == t) {
                            if ($(this).hasClass("wrap"))
                                a[i].wrap = true;
                            addIt = false;
                            break;
                        }
                    }
                }
                if (addIt && t != "") {
                    a.push({ value: t, wrap: $(this).hasClass("wrap") });
                }
            }
        });
    });
    $("#" + section + " span.additional-answer").each(function () {
        var t = $(this).text();
        var addIt = true;
        if (!hideUsedValues && !deleteUsedValues) {
            for (var i = 0; i < a.length; i++) {
                if (a[i].value == t) {
                    addIt = false;
                    break;
                }
            }
        }
        if (addIt) {
            a.push({ value: t, wrap: false });
        }
    });
    while (a.length > 0) {
        var i = randomInt(0, a.length);
        var spanClass = "ui-state-default ui-widget-content ui-corner-all";
        if (a[i].wrap) spanClass += " wrap";
        if (isShort) spanClass += " short";
        drags.append("<span class='" + spanClass + "'>" + a[i].value + "</span>");
        a.splice(i, 1);
    }
    if (shuffleRows)
        $("#" + section + " tbody").shuffle();
    $("#" + section + " tbody tr:odd").addClass("alt-row");
    $("#" + section + " td").each(function () {
        if ($(this).hasClass("checkbox")) {
            $(this).children("img").click(function () {
                var p = $(this).parent();
                if (p.attr("data-check") == "1" && $(this).hasClass("no") || p.attr("data-check") == "0" && $(this).hasClass("yes")) {
                    p.finish();
                    p.css("background-color", "red");
                    p.animate({ backgroundColor: "transparent" }, "fast");
                } else {
                    if (p.attr("data-check") == "1")
                        p.children("img.no").remove();
                    else
                        p.children("img.yes").remove();
                    p.addClass("correct");
                }
            });
        } else {
            $(this).droppable({
                hoverClass: "ui-state-hover",
                drop: function (event, ui) {
                    if (ui.draggable.text() == $(this).text()) {
                        if ($("#hide-used-values").prop("checked"))
                            ui.draggable.css("visibility", "hidden");
                        if ($("#delete-used-values").prop("checked"))
                            ui.draggable.hide();
                        $(this).removeClass("hidden-text");
                        $(this).addClass("correct");
                        $(this).droppable({ disabled: true });
                    } else {
                        $(this).finish();
                        $(this).css("background-color", "red");
                        $(this).animate({ backgroundColor: "transparent" }, "fast");
                    }
                }
            });
        }
    });
    $("#draggables span").draggable({
        cursor: "pointer",
        revert: true,
        revertDuration: 250
    });
};

$(function () {
    var data = $("#data").text().replace("\r\n", "\n").replace("\r", "\n").split("\n");
    var newDiv = "";
    var isHeader = false;
    var subjectNum = 0;
    var wrapcolumns = "";
    var wide = false;
    var comments = [];
    var comment = "";
    var shortRows = false;
    var addAnswers = [];
    var checkboxColumns = "";
    for (var i = 0; i < data.length; i++) {
        var curData = $.trim(data[i]);
        if (curData.substr(0, 4) == "++++") {
            var curOption = curData.substr(4).split(":");
            curOption[0] = curOption[0].toLowerCase();
            switch (curOption[0]) {
                case "wrapcolumns":
                    wrapcolumns = curOption[1]; break;
                case "wide":
                    wide = true; break;
                case "short":
                    shortRows = true; break;
                case "answer":
                    addAnswers.push(curOption[1]); break;
                case "checkboxcolumns":
                    checkboxColumns = curOption[1]; break;
            }
            continue;
        }
        if (curData.substr(0, 4) == "****") {
            subjectNum++;
            $("#subject-menu ul:first").append('<li data-value="' + subjectNum + '">' + curData.substr(4) + '</li>');

            continue;
        }
        if (curData.substr(0, 4) == "----") {
            comments.push(curData.substr(4));
            continue;
        }
        if (curData == "") {
            if (newDiv.length > 0) {
                newDiv += "</tbody></table>";
                if (comments.length > 0)
                    newDiv += "<p>" + comments.join("</p><p>") + "</p>";
                if (addAnswers.length > 0)
                    newDiv += "<span class='additional-answer'>" + addAnswers.join("</span><span class='additional-answer'>") + "</span>";
                $("#content").append(newDiv + "</div>");
            }
            wide = false;
            comments = [];
            wrapcolumns = "";
            checkboxColumns = "";
            newDiv = "";
            shortRows = false;
            addAnswers = [];
            continue;
        }
        var line = curData.split("\t");
        if (line.length == 1) {
            var tableClass = "";
            if (wide) tableClass += " wide";
            if (shortRows) tableClass += " short";
            if (tableClass != "") tableClass = " class='" + tableClass + "'";
            newDiv = "<div id='s" + subjectNum + "-" + line[0].toLowerCase().replace(/[^a-z0-9]/g, "-") + "' class='s" + subjectNum + "'>" +
                    "<h2>" + line[0] + "</h2>" +
                    "<table" + tableClass + "><thead><tr>";
            isHeader = true;
            continue;
        }
        if (isHeader) {
            for (var j = 0; j < line.length; j++)
                newDiv = newDiv + "<th" + (wrapcolumns.indexOf(j) > -1 ? " class='wrap'" : "") + ">" + line[j] + "</th>";
            newDiv = newDiv + "</tr></thead><tbody>";
            isHeader = false;
            continue;
        }
        var line = data[i].split("\t");
        newDiv = newDiv + "<tr>";
        for (var j = 0; j < line.length; j++) {
            var tdClass = "";
            if (wrapcolumns.indexOf(j) > -1) tdClass += " wrap";
            if (checkboxColumns.indexOf(j) > -1) tdClass += " checkbox";
            if (tdClass != "") tdClass = " class='" + tdClass + "'";
            newDiv = newDiv + "<td" + tdClass + ">" + $.trim(line[j]) + "</td>";
        }
        newDiv = newDiv + "</tr>";
    }
    $("#content div").each(function () {
        $(this).clone().attr("id", $(this).attr("id") + "-original").appendTo("#content");
    });
    $("#content h2").addClass("ui-state-default ui-widget-header");
    $("#content table").addClass("ui-state-default");
    $("#content thead tr").addClass("ui-widget-header");
    $("#content tbody tr").addClass("ui-widget-content");
    $("#content tbody td").addClass("ui-widget-content hidden-text");
    $("#content div").each(function () {
        var t = $(this);
        if (t.attr("id").indexOf("-original") < 0)
            $("#section-menu ul:first").append('<li data-value="' + t.attr("id") + '" class="' + t.attr("id").substr(0, t.attr("id").indexOf("-")) + '">' + t.children("h2").text() + '</li>');
        var height = 0;
        t.find("tbody").find("tr").each(function () {
            if ($(this).height() > height) height = $(this).height();
        });
        t.find("tbody").find("tr").each(function () {
            $(this).height(height + "px");
        });
    });
    $("td.checkbox").each(function () {
        var t = $(this);
        t.attr("data-check", t.text());
        t.text("");
        t.html("<img src='yes.png' class='yes' height='21' width='21' />" +
               "<img src='no.png' class='no' height='21' width='21' />");
    });
    $("#menu li").addClass("ui-state-active").hover(
        function () { $(this).removeClass("ui-state-active"); $(this).addClass("ui-state-hover"); },
        function () { $(this).removeClass("ui-state-hover"); $(this).addClass("ui-state-active") }
    );
    $("#section-menu li").click(function () { shuffle($(this).attr("data-value")); });
    $("#subject-menu li").click(function () {
        subjectNum = $(this).attr("data-value");
        $("#container > h1").text($(this).text());
        $("#section-menu li").hide();
        $("#section-menu .s" + subjectNum).show();
        $("#menu > div").accordion("refresh");
        activeSection = $("#section-menu .s" + subjectNum + ":first").attr("data-value");
        shuffle(activeSection);
    });
    var checkboxChanging = false;
    $(":checkbox").change(function () {
        if (checkboxChanging) return;
        checkboxChanging = true;
        var a = $("#shuffle-row-order");
        var b = $("#shuffle-first-column");
        if ($(this).attr("id") == a.attr("id") && a.prop("checked"))
            b.prop("checked", false);
        if ($(this).attr("id") == b.attr("id") && b.prop("checked"))
            a.prop("checked", false);
        var c = $("#hide-used-values");
        var d = $("#delete-used-values");
        if ($(this).attr("id") == c.attr("id") && c.prop("checked"))
            d.prop("checked", false);
        if ($(this).attr("id") == d.attr("id") && d.prop("checked"))
            c.prop("checked", false);
        shuffle(activeSection);
        checkboxChanging = false;
    });
    $("#section-menu li").hide();
    $("#section-menu .s1").show();
    $("#menu > div").accordion({ header: "h3", collapsible: true });
    activeSection = $("#content div:first").attr("id");
    shuffle(activeSection);
});
