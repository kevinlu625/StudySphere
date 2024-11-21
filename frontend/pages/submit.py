import streamlit as st
st.title("Submit")

col1,col2 = st.columns(2)

with col1: 
    st.subheader("Enter a new question")
    question = st.text_area("Question")

with col2: 
    st.subheader("Enter a new answer")
    answer = st.text_area("Answer")

if st.button("Submit"):
        st.switch_page("home.py")