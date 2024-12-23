# StudySphere

### How to use StudySphere

As of now StudySphere can be run and deployed locally from a students laptop while all data is saved in a Postgres database (Supabase). Here are the steps to get StudySphere up and running. 

1. Run 'npm install > requirements.txt' from the cli
2. Go into the backend folder and run 'uvicorn main:app --reload'
3. Go into the react-frontend folder and then go into the studysphere folder and run 'npm run dev'
4. StudySphere should now be up and running on your local host.
5. You can then start creating classes, creating questions, answering questions, downvoting/upvoting questions you dislike/like and doing the same for answers.
6. If something isn't working feel free to contact kevinlu1@seas.upenn.edu

### How the code runs
The code is split between backend and frontend. We are using FastAPI/Python for our backend and Next.JS for our frontend. The data you contribute will help us identify which questions and answers are best/most relevant for a specific class. This can then be used for your personal learning as well as potentially which questions would be most relevant for a professor to put on an exam and the most correct answer(s) to that question. 

#### Project Components

StudySphere is divided into two primary modules: Aggregation Module and Quality Control Module. Each module handles specific aspects of the platform's functionality, contributing to the overall collaborative learning experience by ensuring content quality and user engagement.

---

### Aggregation Module
This module facilitates the core functions of question posting, answer suggestions, and voting, allowing users to interact and contribute content within a structured framework. An explanation of this module can be found in src/StudySphere_Aggregation_Module.ipynb.

#### 1. Choose Class (Point Value: 1)
**Description**:  
The user selects a relevant class for which they want to post or answer questions. This component serves as the entry point for categorizing data.

**High-Level Milestones**:
- Design interface for selecting classes.
- Integration with the class database.
  
#### 1. Choose Midterm/Final (Point Value: 1)
**Description**:  
Users specify whether their questions pertain to midterms or finals.

**High-Level Milestones**:
- UI for specifying the type of exam.
- Backend categorization logic.

#### 3. Post Question (Point Value: 2)
**Description**:  
Users can post questions relevant to the selected class and exam type. The system prompts users to describe their questions clearly.

**High-Level Milestones**:
- Create a user input form.
- Set up backend storage to store and manage posted questions.
- Create UI for viewing questions.

#### 4. Suggest Answer (Point Value: 2)
**Description**:  
Users can contribute suggested answers to posted questions. This component allows for collaborative academic discussion.

**High-Level Milestones**:
- Create UI for submitting answers.
- Establish backend connections to link answers to corresponding questions.
- Create UI for viewing answers under their corresponding questions.

#### 5. Vote on Questions (Point Value: 2)
**Description**:  
Users can vote on questions based on relevance, clarity, and quality.

**High-Level Milestones**:
- Implement voting mechanism.
- Display voting results dynamically.

#### 6. Vote for Suggested Answers (Point Value: 2)
**Description**:  
Users can vote on answers based on relevance, clarity, and quality.

**High-Level Milestones**:
- Implement voting mechanism (simple majority vote).
- Display voting results dynamically.

---

### Quality Control Module

This module ensures content quality by prioritizing high-value contributions and minimizing irrelevant or low-quality input. It does this through simple majority vote mechanisms.  By leveraging crowd feedback and setting automated quality standards, StudySphere maintains a useful and reliable question bank. An explanation of this module can be found in src/StudySphere_QC_Module.ipynb.

#### 1. Display Top 2-3 Answers (Point Value: 1)
**Description**:  
After votes are cast, the top few answers are displayed prominently with majority vote.

**High-Level Milestones**:
- Develop logic for answer ranking.
- Design the UI to prominently display the top answers.

#### 2. Rank Questions by Votes (Point Value: 1)
**Description**:  
Questions are ranked based on their votes, with the highest voted questions appearing first for greater visibility.

**High-Level Milestones**:
- Develop logic for question ranking.
- Design the UI to prominently display the top questions.

#### 3. Remove Questions with Too Many Downvotes (Point Value: 3)
**Description**:  
Questions with too many downvotes are removed from the system to maintain quality and relevance.

**High-Level Milestones**:
- Implement backend logic to monitor downvote thresholds and automate removal.
- Notify users when their questions are removed to encourage constructive feedback.

#### 4. Ban Users Who Post Irrelevant Questions (Point Value: 3)
**Description**:  
Users who consistently post irrelevant or low-quality questions are banned to ensure the integrity of the platform.

**High-Level Milestones**:
- Develop criteria for what counts as a irrelevant or low-quality question
- Develop criteria for banning users.
- Implement a review system to avoid false positives.

---

## Data
We will incorporate data from example_cards.csv as a starting point. The other data will be from the users themselves. The data from the users will be in JSON format with Question Type, Question, and Answer. The users will be able to select the type of question (which could be Multiple Choice, Short Answer, etc.) they want to add, the question, and a potential answer to it. The data will also contain the user who submitted the question, where unique usernames are used as well as unique QuestionIds to determine the specific question it is. An example of data retrieved from 3 user inputs is as follows: 

```json
[
  {
    Username: "User1", 
    Question Type: "Multiple Choice",
    Question: "What elements are in the periodic table?", 
    QuestionId: 1,
    Answer: "Carbon, Mitochondria, Nucleus"
  }, 
  {
    Username: "User2",
    Question Type: "Short Answer",
    Question: "What is the mitochondria?", 
    QuestionId: 2,
    Answer: "The powerhouse of the cell."
  }, 
  {
    Username: "User3", 
    Question Type: "Short Answer",
    Question: "What algorithm can be used to sort a list?", 
    QuestionId: 3,
    Answer: "Quick Sort"
  }, 
  {
    Username: "User4", 
    Question Type: "Short Answer",
    Question: "What algorithm can be used to sort a list?", 
    QuestionId: 3,
    Answer: "Merge Sort"
  }  
]
``` 
The username is the username of the user that votes. 
The data for voting on a question will be as follows, where it will vote on a specific question identified by the QuestionId and Upvote will be True if the user voted positively and False otherwise:

```json
[ 
  {
    Username: "User5",
    QuestionId: 3,
    Upvote: True 
  },  
  {
    Username: "User6", 
    QuestionId: 2, 
    Upvote: False 
  } 
] 

```
The data for voting on an answer will be as follows, where it will vote on a specific question identified by the QuestionId and the Answer will be the answer that the user likes best and votes for:

```json

[ 
  { 
    Username: "User7",
    QuestionId: 3, 
    Answer: "Quick Sort"
  },
  { 
    Username: "User8",
    QuestionId: 3,
    Answer: "Merge Sort" 
  } 
] 

```
The QC module will remove questions with a certain amount of downvotes as well as ban users with too many removed questions. The aggregation model will sum the number of votes for a specific answer or a specific question to determine which is the most popular. Similarly, if a certain question reaches a certain threshold number of downvotes, it will be removed and no longer be displayed on the website, which is used for the QC module. Similarly, users with a username that has a certain number of questions removed will be banned, which is by counting the number of questions removed per user, which is also used for the QC module. 
