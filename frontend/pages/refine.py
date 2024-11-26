import streamlit as st
st.title("Refine")

col1,col2 = st.columns(2)

with col1: 
    st.subheader("Sample Question")
    question = st.text_area("Refine Question")

with col2: 
    st.subheader("Sample Answer")
    answer = st.text_area("Refine Answer")

if st.button("Submit"):
        st.switch_page("home.py")