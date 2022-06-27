import { getDocs, query, where } from "firebase/firestore";
import { userCollectionRef } from "../Library/firebase.collections";
import { getUser, updateUser, updateUserDb } from "../Model/User";

export function notifyAdminDeletionWorkspace(adminId, notification) {
  adminId.map(async (id) => {
    console.log(id);
    const q = query(userCollectionRef, where("userId", "==", id));
    getDocs(q).then((doc) => {
      const user = { ...doc.docs[0].data(), id: doc.docs[0].id };
      if (user.notificationFrequency == "Never") {
        return;
      }
      user.notificationList = [...user.notificationList, notification];
      updateUserDb(user).then(() => {
        console.log("success");
      });
    });
  });
}

export function notifyJoinMember(workspace, notification) {
  const member = [...workspace.memberId, ...workspace.adminId];
  member.map((userId) => {
    getUser(userId).then((doc) => {
      const user = doc.docs[0].data();
      if (user.notificationFrequency == "Never") {
        return;
      }
      user.notificationList = [...user.notificationList, notification];
      updateUserDb(user).then(() => {
        console.log("Succeed");
      });
    });
  });
}

export function notifyCommentWatcher(watcherId, notification) {
  watcherId.map((id) => {
    getUser(id).then((doc) => {
      const user = doc.docs[0].data();
      if (user.notificationFrequency == "Never") {
        return;
      }
      user.notificationList = [...user.notificationList, notification];
      updateUserDb(user).then(() => {
        console.log("Succeed");
      });
    });
  });
}

export function remindingAllWatcher(watcherId, reminder) {
  watcherId.map((id) => {
    getUser(id).then((doc) => {
      const user = { ...doc.docs[0].data(), id: doc.docs[0].id };
      if (user.notificationFrequency == "Never") {
        return;
      }

      user.reminder = [...user.reminder, reminder];
      updateUserDb(user).then(() => {
        console.log("Succeed");
      });
    });
  });
}
