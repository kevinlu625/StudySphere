# StudySphere

#### Project Components

StudySphere is divided into two primary modules: Aggregation Module and Quality Control Module. Each module handles specific aspects of the platform's functionality, contributing to the overall collaborative learning experience by ensuring content quality and user engagement.

---

### Aggregation Module
This module facilitates the core functions of question posting, answer suggestions, and voting, allowing users to interact and contribute content within a structured framework.

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
- Implement voting mechanism.
- Display voting results dynamically.

---

### Quality Control Module

This module ensures content quality by prioritizing high-value contributions and minimizing irrelevant or low-quality input. By leveraging crowd feedback and setting automated quality standards, StudySphere maintains a useful and reliable question bank.

#### 1. Display Top 2-3 Answers (Point Value: 1)
**Description**:  
After votes are cast, the top few answers are displayed prominently.

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
The data from the users will be in JSON format with Question Type, Question, and Answer. The users will be able to select the type of question (which could be Multiple Choice, Short Answer, etc.) they want to add, the question, and a potential answer to it. The data will also contain the user who submitted the question, where unique usernames are used as well as unique QuestionIds to determine the specific question it is. An example of data retrieved from 3 user inputs is as follows: 
```json
{
  [
    Username: "User1", 
    Question Type: "Multiple Choice",
    Question: "What elements are in the periodic table?", 
    QuestionId: 1,
    Answer: "Carbon, Mitochondria, Nucleus"
  ], 
  [
    Username: "User2",
    Question Type: "Short Answer",
    Question: "What is the mitochondria?", 
    QuestionId: 2,
    Answer: "The powerhouse of the cell."
  ], 
  [
    Username: "User3", 
    Question Type: "Short Answer",
    Question: "What algorithm can be used to sort a list?", 
    QuestionId: 3,
    Answer: "Quick Sort"
  ], 
  [
    Username: "User4", 
    Question Type: "Short Answer",
    Question: "What algorithm can be used to sort a list?", 
    QuestionId: 3,
    Answer: "Merge Sort"
  ]  
}
The username is the username of the user that votes. 
The data for voting on a question will be as follows, where it will vote on a specific question identified by the QuestionId and Upvote will be True if the user voted positively and False otherwise: 
```json
{ 
  [
    Username: "User5",
    QuestionId: 3,
    Upvote: True 
  ],  
  [ 
    Username: "User6", 
    QuestionId: 2, 
    Upvote: False 
  ] 
} 

The data for voting on an answer will be as follows, where it will vote on a specific question identified by the QuestionId and the Answer will be the answer that the user likes best and votes for:
```json
{ 
  [ 
    Username: "User7",
    QuestionId: 3, 
    Answer: "Quick Sort"
  ],
  [ 
    Username: "User8",
    QuestionId: 3,
    Answer: "Merge Sort" 
  ] 
} 


