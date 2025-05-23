$(document).ready(function () {
  $("#tumorForm").on('submit', function (event) {
    event.preventDefault();
    console.log("Form submitted");

    // Gather form data into an object
    const data = {
      Age: parseInt($("#age").val()),
      Gender: $("#gender").val(),
      Tumor_Type: $("#tumor_type").val(),
      Tumor_Size: parseFloat($("#tumor_size").val()),
      Location: $("#location").val(),
      Histology: $("#histology").val(),
      Stage: $("#stage").val(),
      Symptom_1: $("#symptom_1").val(),
      Symptom_2: $("#symptom_2").val(),
      Symptom_3: $("#symptom_3").val(),
      Radiation_Treatment: $("#radiation").val(),
      Surgery_Performed: $("#surgery").val(),
      Chemotherapy: $("#chemotherapy").val(),
      Survival_Rate: parseInt($("#survival_rate").val()),
      Tumor_Growth_Rate: parseFloat($("#tumor_growth_rate").val()),
      Family_History: $("#family_history").val(),
      MRI_Result: $("#mri_result").val()
    };

    console.log("Data to be sent:", JSON.stringify(data,null,2));

    $.ajax({
      url: 'http://localhost:8080/api/predict',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function (res) {
        const prediction = res.Prediction[0];

        let output = "<h3>Prediction Result</h3>";
        for (const [label, prob] of Object.entries(prediction)) {
          output += `<p>${label}: ${prob}%</p>`;
        }

        $('#result').html(output);
      },
      error: function () {
        $('#result').html('<p style="color:red;">Something went wrong. Please try again.</p>');
      }
    });
  });
});
