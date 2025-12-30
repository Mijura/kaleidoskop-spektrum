import { eventBus } from "@domain/events/event-bus"
import { TaskExecution } from "@domain/task-execution"

export class EmitNewTaskExecution {

    static emit(taskExecution: TaskExecution): void {
      	eventBus.emit("task-execution:new", taskExecution)
    }

}
