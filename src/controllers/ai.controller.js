const gemeniService = require("../services/gemeni.service");
const pdf = require("pdf-parse");
const LOG_TAG = "-->";

async function generateInterviewQuestions(req, res) {
  try {
    console.debug(
      LOG_TAG + " Entered into post generateAiResponse methode: " + Date.now(),
    );
    const domain = req.body.domain;
    const experience = req.body.experience;

    if (!domain) {
      return res.status(400).json({
        success: false,
        message: " Domain is required ",
      });
    }

    const prompt = `
        Generate 10 technical interview questions.
        Return ONLY valid JSON.
        Do not wrap the response in markdown.
        Do not use \`\`\`json .
        Do not add explanations.

        Domain: ${domain}
        Experience: ${experience} || "Fresher"
        Adjust difficulty accordingly.
        Rules:
        - Adjust difficulty according to experience.
        - Focus on practical interview questions.
        - Avoid generic aptitude questions.
        - Return ONLY valid JSON.

         {
            "questions": [
              {
              "question": "",
               "difficulty": ""
               }
            ]
         }
        `;

    const response = await gemeniService.generateResponse(prompt);
    const jsonResponse = JSON.parse(response);

    res.status(200).json({
      success: true,
      response: jsonResponse,
    });
  } catch (err) {
    console.error(
      LOG_TAG,
      "Gemini service is currently unavailable. Please try again later.",
    );

    res.status(400).json({
      success: false,
      err: "Gemini service is currently unavailable. Please try again later",
    });
    return "Gemini service is currently unavailable. Please try again later.";
  }
}

async function generateResumeResponse(req, res) {
  try {
    console.debug(
      LOG_TAG,
      "Entered into generateResumeResponse : " + Date.now(),
    );
    if (!req.file) {
      return res.status(400).json({
        message: " please upload a pdf",
      });
    }

    const resumeData = await pdf(req.file.buffer);
    const prompt = `
               Analyze this resume.
               Return ONLY valid JSON.
               Do not wrap the response in markdown.
               Do not use \`\`\`json.
            Do not add explanations.

           {
             "score": 0,
             "strengths": [],
             "missingSkills": [],
             "improvements": [],
             "atsTips": []
            }

        Resume:
         ${resumeData.text}
        `;
    const response = await gemeniService.generateResponse(prompt);
    const parseResponse = JSON.parse(response);
    res.status(200).json({
      success: true,
      response: parseResponse,
    });
  } catch (err) {
    console.error(
      LOG_TAG,
      "Gemini service is currently unavailable. Please try again later.",
    );
    res.status(400).json({
      success: false,
      err: "Gemini service is currently unavailable. Please try again later",
    });
    return "Gemini service is currently unavailable. Please try again later.";
  }
}

async function generateResumeSkillGapResponse(req, res) {
  try {
    console.debug(
      LOG_TAG,
      " Entered into generateResumeSKillGapResponse methode: " + Date.now(),
    );
    const targetDomain = req.body.targetDomain;
    if (!req.file) {
      return res.status(400).json({
        message: " Please upload an pdf file ",
      });
    }

    if (!targetDomain) {
      return res.status(200).json({
        success: false,
        message: " Please Enter your targetDomain",
      });
    }
    const resumeData = await pdf(req.file.buffer);

    if (resumeData == undefined) {
      return res.status(400).json({
        message: " unable to read resume Data",
      });
    }

    const prompt = `
               Analyze this resume and campare with targetDomain ${targetDomain}.
               Return ONLY valid JSON.
               Do not wrap the response in markdown.
               Do not use \`\`\`json.
            Do not add explanations.

           {
             
            "matchPercentage": 0,
            "currentSkills": [],
            "missingSkills": [],
            "recommendedRoles": [],
            "learningRoadMap": []

            }

        Resume:
         ${resumeData.text}
        `;

    const response = await gemeniService.generateResponse(prompt);
    const skillGapResponse = JSON.parse(response);

    res.status(200).json({
      success: true,
      response: skillGapResponse,
    });
  } catch (err) {
    console.debug(LOG_TAG, err);
    res.status(400).json({
      success: false,
    });
  }
}

async function eveluateInterviewAnswer(req, res) {
  try {
    console.debug(LOG_TAG, " Entered into eveluateInterviewAnswer: " + Date.now());
    if (req.body.questionAnswers) {
      const questionAnswers = req.body.questionAnswers;

      if (questionAnswers.length == 0) {
        return res.status(400).json({
          status: false,
          message: " question Answers are empty"
        });
      }

     const prompt = `
                You are a senior technical interviewer.
                Evaluate each question-answer pair.

               Candidate Responses:
             ${JSON.stringify(questionAnswers, null, 2)}
              Do not wrap the response in markdown.
               Do not use \`\`\`json.
              Scoring Rules:
                - Score each answer from 0 to 10 .
                - Consider correctness, completeness, and technical accuracy.
                - Mention strengths.
                - Mention improvements.
                - Calculate overall score as the average of all question scores.
                - Provide overall feedback.
                  Return ONLY valid JSON.
            {
               "overallScore": 0,
              "questionEvaluations": [
               {
                 "question": "",
                 "score": 0,
                 "strengths": [],
                "improvements": [],
                "idealAnswer": ""
             }
            ],
            "overallFeedback": ""
         }
       `;
      const response = await gemeniService.generateResponse(prompt);
      res.status(200).json({
        success: true,
        response: JSON.parse(response)
      });
    } else {
      const question = req.body.question;
      const answer = req.body.answer;
      console.debug(LOG_TAG, " question: " + question, "answer: " + answer);
      if (!question || !answer) {
        return res.status(400).json({
          success: false,
        });
      }
      const prompt = `Evaluate the following interview answers  ${answer} or question ${question}.
                Return ONLY valid JSON.
                Do not wrap the response in markdown.
                Do not use \`\`\`json.
                Do not add explanations.
                {
                   "overallScore": 0,
                   "questionEvaluations": [
                {
                  "question": "",
                  "score": 0,
                  "strengths": [],
                  "improvements": []
                }
                ],
                "overallFeedback": ""`;
      const response = await gemeniService.generateResponse(prompt);
      const jsonResponse = JSON.parse(response);
      res.status(200).json({
        success: true,
        message: jsonResponse,
      });
    }
  } catch (err) {
    res.status(400).json({
      success: false,
      message: " error",
    });
    return "gemeni Service is not available please try later";
  }
}

module.exports = {
  generateInterviewQuestions,
  generateResumeResponse,
  generateResumeSkillGapResponse,
  eveluateInterviewAnswer,
};
