import { useState, useEffect, useRef } from 'react';
import './CodingSection.css'
import html2pdf from 'html2pdf.js';


const CodingSection = (prop) => {
  const [answers, setAnswers] = useState(prop.code);

  const handleAnswerChange = async (qid, value) => {
    const code = ({
      ...answers,
      [qid]: value,
    });
    setAnswers(code);
    try {
      const response = await fetch('https://asia-south1-ppt-tts.cloudfunctions.net/ml-quiz1/code', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${prop.token}`
        },
        body: JSON.stringify({ code, save_only: true })
      });
      const result = await response.json();
    } catch (error) {
      console.error('Error submitting answers:', error)
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = answers;
    console.log(answers);
    const response = await fetch('https://asia-south1-ppt-tts.cloudfunctions.net/ml-quiz1/code', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${prop.token}`
      },
      body: JSON.stringify({ code })
    });
    prop.setProgress(2);
    prop.setIsExamCompleted(true);
    const textboxes = document.querySelectorAll('.code-answer');
    console.log(textboxes)
    textboxes.forEach(textbox => {
      const div = document.createElement('code');
      div.classList.add('printable');
      div.innerHTML = textbox.value.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');

      textbox.parentNode.insertBefore(div, textbox);
      textbox.style.display = 'none'
    })
    document.getElementById('coding-answers').classList.add('printable');
    html2pdf().from(document.getElementById('coding-answers')).set({
      pagebreak: {
        avoid: 'div, textarea, p'
      },
      filename: prop.email.split('@')[0] + '-code.pdf'
    }).save()
  }

  return (
    <div className="coding-section">
      <iframe
        className="notebook"
        id="notebook"
        src="https://flame-cai.github.io/jupyter/lab/index.html?path=help.ipynb"
        title="JupyterLite"
      ></iframe>
      <div id="coding-answers" className="coding-answers">
        <form onSubmit={handleSubmit}>
          {prop.questions.map((question) => (
            <div key={question.qid} style={{ marginBottom: '30px' }}>
              <p dangerouslySetInnerHTML={{ __html: question.question }}>
              </p>
              <textarea className="code-answer" rows="10" placeholder="Write your answer here..." value={answers[question.qid] || ''} onChange={(e) => handleAnswerChange(question.qid, e.target.value)} ></textarea>
            </div>
          ))}
          <div className="confirm-wrapper">
            <input type="checkbox" id="confirm" name="confirm" value="confirm" required></input>&nbsp;
            <label htmlFor="confirm">I acknowledge that by submitting my exam, I will not have the opportunity to resubmit.</label>
          </div>
          <button type="submit">Submit Answers</button>
        </form>

      </div>
    </div>
  )
}

export default CodingSection;