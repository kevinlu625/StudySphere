import streamlit as st
st.title("Test")

with st.container(): 
    col1,col2 = st.columns(2)

    with col1: 
        st.subheader("Questions")

    with col2: 
        st.subheader("Answers")

    with st.container(border=2): 
        col3,col4 = st.columns(2)   
        with col3: 
            with st.container(): 
                st.text("Sample Multiple Choice Question")        
        with col4: 
            answers = st.multiselect("Answers", ["Answer1", "Answer2"])
            st.write(answers)

    with st.container(border=2): 
        col3,col4 = st.columns(2)   
        with col3: 
            with st.container(): 
                st.text("Sample Short Answer Question")        
        with col4: 
            answers = st.text_area("Your Answer")
            st.write(answers)


if st.button("Submit"):
    st.switch_page("home.py")