import { useState, useEffect, useRef } from 'react';
import './McqSection.css'
import html2pdf from 'html2pdf.js';



const McqSection = (prop) => {
    const [answers, setAnswers] = useState(prop.mcq);

    const handleMCQ = async (qid, oid) => {
        const mcq = ({
            ...answers,
            [qid]: oid,
        });
        setAnswers(mcq)
        // console.log({ mcq, save_only:false })
        try {
            const response = await fetch('https://asia-south1-ppt-tts.cloudfunctions.net/ml-quiz1/mcq', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${prop.token}`
                },
                body: JSON.stringify({ mcq, save_only: true })
            });
            const result = await response.json();
        } catch (error) {
            console.error('Error submitting answers:', error)
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        prop.setProgress(1);
        console.log(prop.email);
        html2pdf().from(document.getElementById('McqSection')).set({
            pagebreak: {
                avoid: 'div'
            },
            filename: prop.email.split('@')[0] + '-mcq.pdf'
        }).save();
        try {
            const response = await fetch('https://asia-south1-ppt-tts.cloudfunctions.net/ml-quiz1/mcq', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${prop.token}`
                },
                body: JSON.stringify({ save_only: false })
            });
            const result = await response.json();
            console.log(result);
            
            console.log("exit")
        } catch (error) {
            console.error('Error submitting answers:', error)
        }
    }



    return (
        <div id='McqSection' className='McqSection'>
            <form onSubmit={handleSubmit}>
                {prop.questions.map((question) => (
                    <div key={question.qid}>
                        <p> <strong>Question {question.qid}:</strong> {question.question} </p>
                        {question.options.map((option) => (
                            <div key={option.oid}>
                                <input id={`${question.qid}-${option.oid}`} type="radio" name={`${question.qid}`} value={option.oid} checked={answers[question.qid] === option.oid} onChange={() => handleMCQ(question.qid, option.oid)} required />
                                <label htmlFor={`${question.qid}-${option.oid}`}>{option.option}</label>
                            </div>
                        ))}
                    </div>
                ))}
                <br></br>
                <div className="confirm-wrapper">
                    <input type="checkbox" id="confirm" name="confirm" value="confirm" required></input>&nbsp;
                    <label htmlFor="confirm">I acknowledge that by submitting my exam, I will not have the opportunity to resubmit.</label>
                </div>
                <button type='Submit'>Submit</button>
            </form>
        </div>
    )
}

export default McqSection;