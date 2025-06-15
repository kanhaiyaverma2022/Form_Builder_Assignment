const fs = require('fs');
const path = require('path');

// Submit form data
const submitForm = (req, res) => {
  try {
    const formId = req.params.id;
    const { formData, fields } = req.body;

    // Create submission object
    const submission = {
      formId: formId,
      data: formData || {},
      fields: fields || [],
      submittedAt: new Date().toISOString(),
    };

    // Create filename with timestamp
    const fileName = `form_${formId}_${Date.now()}.json`;
    const filePath = path.join(__dirname, '../data', fileName);

    // Save to JSON file
    fs.writeFileSync(filePath, JSON.stringify(submission, null, 2));

    console.log(`✅ Form submitted successfully: ${fileName}`);
    console.log(`📊 Data:`, formData);

    res.status(200).json({
      success: true,
      message: 'Form submitted successfully',
      submissionId: fileName,
      submittedAt: submission.submittedAt
    });

  } catch (error) {
    console.error('❌ Error submitting form:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting form',
      error: error.message
    });
  }
};

module.exports = {
  submitForm
};