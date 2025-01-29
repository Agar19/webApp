//Sign-up hiih 
document.getElementById("signup-form").addEventListener("submit", async function (event) {
    event.preventDefault();
  
    let username = document.getElementById('username').value;
    let email = document.getElementById("signup-email").value;
    let password = document.getElementById("signup-password").value;
    let confirmPassword = document.getElementById("signup-password-confirm").value;
  
    let messageElement = document.getElementById("messageSignUp");
  
    if (!isValidPassword(password)) {
      messageElement.textContent = "Нууц үг багадаа 8 тэмдэгтээс бүрдэх ба хамгийн багадаа нэг тоо, хамгийн багадаа нэг том үсэг, багадаа нэг жижиг үсэг агуулсан байх шаардлагатай!";
      return;
    }
  
    if (password !== confirmPassword) {
      messageElement.textContent = "Нууц үг таарахгүй байна!";
      return;
    }
  
    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({username, email, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Success:", data);
        alert("Бүртгэл амжилттай!");
        location.reload();
        
        
      } else if (response.status === 400) {
    
        const errorResponse = await response.json();
        messageElement.textContent = "Имэйл хаяг бүртгэгдсэн байна!";
  
      } else {
        const errorResponse = await response.json();
        throw new Error(`Network response was not ok. Status: ${response.status}, Message: ${errorResponse.message}`);
      }
      
    } catch (error) {
      console.error("Error:", error);
      messageElement.textContent = "Алдаа гарлаа: " + error.message;
    }
  });
  
  
  //Passwordiig shalgah
  function isValidPassword(password) {
    //"Нууц үг нь дээд тал нь 8 тэмдэгтээс их, хамгийн багадаа нэг тоо, хамгийн багадаа нэг том үсэг, багадаа нэг жижиг үсэг агуулсан байх шаардлагатай!"
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
  }