import User from '../models/user.model';
import { ObjectId } from 'mongodb';

export async function performTask(
  userId: ObjectId,
  taskName: string
): Promise<void> {
  const user = await User.findById(userId);
  if (user) {
    taskName = taskName + ' el ' + new Date().toLocaleString();
    user.lastThreeTasks.push(taskName);
    if (user.lastThreeTasks.length > 3) {
      user.lastThreeTasks.shift();
    }
    await user.save();
  }
}
