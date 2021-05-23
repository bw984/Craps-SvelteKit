<script>
    export let task = {};
  
    let isChecked;
  
    async function taskDone(todo) {
      console.log(isChecked);
      todo.completed = true
      try {
            const res = await fetch ('/todos', {
                method: 'PUT',
                body: JSON.stringify(todo)
            })
            console.log(res)
        } catch(err) {
            alert('There was an error.');
        }
    }
  </script>
  
  <style>
    .completed {
      color: red;
      text-decoration: line-through;
    }
  </style>
  
  <main>
    <li class="list-group-item">
      <input
        type="checkbox"
        class="form-check-input"
        id="exampleCheck1"
        bind:checked={task.completed}
        on:change={taskDone(task)} />
      <span class:completed={task.completed}>{task.description}</span>
    </li>
  </main>