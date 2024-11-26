import streamlit as st
st.title("Vote")

with st.container(): 
    col1,col2 = st.columns(2)

    with col1: 
        st.subheader("Upvote/Downvote the Question")

    with col2: 
        st.subheader("Vote for the Best Answer")

    with st.container(border=2): 
        col3,col4 = st.columns(2)   
        with col3: 
            with st.container(): 
                st.text("Sample Question")
                st.feedback("thumbs")
        
        with col4: 
            answers = st.multiselect("Sample Answers", ["Answer1", "Answer2"])
            st.write(answers)

if st.button("Submit"):
    st.switch_page("home.py")