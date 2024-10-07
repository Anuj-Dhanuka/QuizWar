import firestore from "@react-native-firebase/firestore";
import storage from '@react-native-firebase/storage';  // Firebase storage
import auth from "@react-native-firebase/auth";

export class Apiutils {

  static async fetchGameCategories() {
    try {
      const categoriesRef = firestore().collection("Categories");
      const categoriesSnapshot = await categoriesRef.get();

      const categoriesData = categoriesSnapshot.docs.map((categoryDoc) => {
        const categoryData = categoryDoc.data();
        const categoryId = categoryDoc.id;

        return {
          id: categoryId,
          ...categoryData,
        };
      });

      return categoriesData;
    } catch (error) {
      console.error("Error fetching game categories:", error);
      throw error;
    }
  }

  static async fetchUserProfile(userId) {
    try {
      if (!userId) {
        throw new Error("User ID is missing");
      }

      const userDoc = await firestore().collection('Users').doc(userId).get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        console.log("User data:", userData);
        return {
          id: userId,
          ...userData,
        };
      } else {
        throw new Error('User data not found');
      }
    } catch (error) {
      console.error("Error fetching user profile:", error); 
      throw error;
    }
  }

  static async fetchUserPerformance(userId) {
    try {
      if (!userId) {
        throw new Error('User is not authenticated');
      }

      const performanceDoc = await firestore().collection('Userperformance').doc(userId).get();

      if (performanceDoc.exists) {
        const performanceData = performanceDoc.data();
        return {
          userId: userId,
          ...performanceData,
        };
      } else {
        throw new Error('Performance data not found');
      }
    } catch (error) {
      console.error("Error fetching user performance:", error);
      throw error;
    }
  }

  static async fetchAllUsersPerformance() {
    try {
      const performanceCollection = await firestore().collection('Userperformance').get();
      
      if (!performanceCollection.empty) {
        const allUsersPerformance = performanceCollection.docs.map(doc => ({
          userId: doc.id,
          ...doc.data(),
        }));
  
        return allUsersPerformance;
      } else {
        throw new Error('No performance data found');
      }
    } catch (error) {
      console.error("Error fetching all users' performance:", error);
      throw error;
    }
  }
  

  static async uploadImageToFirebase(imagePath, userId) {
    const fileName = `profilePictures/${userId}_${Date.now()}`;
    const reference = storage().ref(fileName);
  
    try {
      const uploadTask = await reference.putFile(imagePath);
      const downloadUrl = await reference.getDownloadURL();
      console.log('Image uploaded to Firebase, URL: ', downloadUrl);
      return downloadUrl;
    } catch (error) {
      console.error('Failed to upload image to Firebase Storage:', error);
      throw error;
    }
  }
  

static async updateUserProfile(userId, updatedProfileData) {
  try {
    if (!userId) {
      throw new Error('User ID is missing');
    }

    const userRef = firestore().collection('Users').doc(userId);
    await userRef.set(updatedProfileData, { merge: true });

    console.log('User profile successfully updated');
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}


  static async updateUserScore(userId, scoreData) {
    try {
      if (!userId) {
        throw new Error('User is not authenticated');
      }

      const scoresRef = firestore().collection('Scores').doc(userId);

      await scoresRef.set(scoreData, { merge: true });

      console.log('User score successfully updated');
    } catch (error) {
      console.error('Error updating user score:', error);
      throw error;
    }
  }

  static async updateUserPerformance(userId, performanceData) {
    try {
      if (!userId) {
        throw new Error('User is not authenticated');
      }

      // Create a shallow copy of performanceData and remove the unwanted fields
      const { userPerformanceIsLoading, userPerformanceError, ...updatedPerformanceData } = performanceData;
      console.log("updated performance data: ", updatedPerformanceData)

      const performanceRef = firestore().collection('Userperformance').doc(userId);
      await performanceRef.set(updatedPerformanceData, { merge: true });

      console.log("User performance successfully updated");
    } catch (error) {
      console.log("Error updating user performance: ", error);
      throw error;
    }
  }

}
