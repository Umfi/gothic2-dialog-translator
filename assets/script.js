/**
 * Reset the document and clear the input forms to initial state.
 */
function reset() {
  $("#skript").val("");
  $('#ger').val("");
  $("#ger").attr("disabled", true);
  $('#eng').val("");
  $("#eng").attr("disabled", true);
  $('#final').val("");
  $("#final").attr("disabled", true);
  $("#linktodeepl").attr("href", "#");
  $("#linktodeepl").removeClass("btn-primary");
  $("#linktodeepl").addClass("disabled btn-dark");
}

/**
 * Copy the text from translated script into the clipboard.
 */
function copy() {
  var copyText = $("#final");
  copyText.select();
  document.execCommand("copy");
}

/**
 * Extratc the text to translate from the script.
 */
function extract() {
  var skript = $('#skript').val();

  // Regex to parse text from ai_output, description and info_addchoice
  var re = /(?:(ai_output[A-Z0-9\s\(\,]+\"[A-Z0-9\_]+\"[\)\;\s]+\/\/)|(description[\s\=]+[\"])|(info_addchoice[\s\(A-Z0-9\_\,]*[\"]))([A-Z0-9\ \ß\.\-\,\*\!\?\'\…\ä\ö\ü\(\)\+\-]*)(?:[\"\;])*/gi;
  var match;
  var ger_text = "";

  while (match = re.exec(skript)) {
    ger_text = ger_text + match[4] + "\n";
  }

  $("#ger").val(ger_text);

  $("#linktodeepl").attr("href", "https://www.deepl.com/translator#de/en/" + encodeURI(ger_text));
  $("#linktodeepl").removeClass("disabled btn-dark");
  $("#linktodeepl").addClass("btn-primary");
}

/**
 * Replace german texts with english text in the script.
 */
function generate() {
  var skript = $('#skript').val();

  var ger_lines = $('#ger').val().split(/\n/);
  var ger_texts = [];
  for (var i = 0; i < ger_lines.length; i++) {
    if (/\S/.test(ger_lines[i])) {
      ger_texts.push($.trim(ger_lines[i]));
    }
  }

  var eng_uncleaned = $('#eng').val();
  var eng_cleaned = eng_uncleaned.replace("Translated with www.DeepL.com/Translator", "");
  var eng_lines = eng_cleaned.split(/\n/);
  var eng_texts = [];
  for (var i = 0; i < eng_lines.length; i++) {
    if (/\S/.test(eng_lines[i])) {
      eng_texts.push($.trim(eng_lines[i]));
    }
  }

  for (var i = 0; i < eng_lines.length; i++) {
    skript = skript.replace(ger_texts[i], eng_texts[i]);
  }

  $("#final").val(skript);
  $("#final").attr("disabled", false);
  $("#copy").attr("disabled", false);
}


$(document).ready(function() {

  $("#myfile").on("change", function(changeEvent) {
    for (var i = 0; i < changeEvent.target.files.length; ++i) {
      (function(file) {
        var loader = new FileReader();
        loader.onload = function(loadEvent) {
          if (loadEvent.target.readyState != 2)
            return;
          if (loadEvent.target.error) {
            alert("Error while reading file " + file.name + ": " + loadEvent.target.error);
            return;
          }

          reset();
          $("#skript").val(loadEvent.target.result);
          extract();

        };
        // so that i can read the files with correct encoding on my linux host
        loader.readAsText(file, 'CP1250');
      })(changeEvent.target.files[i]);
    }
  });


  $('#linktodeepl').click(function() {
    $("#eng").attr("disabled", false);
  });

  $('#eng').blur(function() {
    generate();
  });

  $('[data-toggle="tooltip"]').tooltip();


});
