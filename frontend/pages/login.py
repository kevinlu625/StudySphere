import streamlit as st
st.title("Login")

col1,col2 = st.columns(2)

with col1: 
    st.subheader("Existing User")
    username1 = st.text_input("Username")
    password1 = st.text_input("Password")
    if st.button("Login"):
        st.switch_page("home.py")

with col2: 
    st.subheader("New User")
    username2 = st.text_input("New Username")
    password2 = st.text_input("New Password")
    if st.button("Register"):
        st.switch_page("home.py")