<template>
  <div class="w-full h-full">
    <Navbar />
    <div class="px-10 mx-auto">
      <div class="flex items-center justify-between mt-9 border-b-2 border-b-divider" >
        <div class="flex items-center gap-2.5 mb-2.5">
          <img src="~/static/icon.svg" />
          <h1 class="text-2xl text-title">Cadastro Usuário</h1>
          <div id="info" class="w-4 h-4 mt-1 rounded-full border-2 border-divider relative cursor-pointer">
            <p class="text-divider text-pvsm absolute left-[4px] top-[-4px]"> i </p>
            <div id='tooltip' class="text-pvsm text-title p-2 pt-1.5 absolute w-52 left-4 top-0 rounded bg-form shadow-tooltip" >
              <p>Cadastre os usuários que terão acesso ao sistema.</p>
            </div>
          </div>
        </div>
        <p class="self-end text-pvsm">*campos obrigatórios</p>
      </div>
      <div class="bg-form mt-5 px-5 pt-4 pb-7  rounded shadow-box">
        <Form :users-list="users"  @add-user="addUser($event)" @update-user="updateUser($event)"/>
        <Table :users-list="users" />
      </div>
    </div>
  </div>
</template>

<script>
import Form from '../components/Form.vue';
import Table from '../components/Table.vue';
import Navbar from '~/components/Navbar.vue';

export default {
  name: 'IndexPage',
  components: { Navbar, Table, Form },
  data() {
    return {
      users: [
        
      ],
      id: '',
      tooltip: false   
    };
  },
  methods:{
    addUser(user){
      this.users.push(user);
    },
    updateUser(user){
      const id = user.id
      this.users[id].nome = user.nome
      this.users[id].cpf = user.cpf
      this.users[id].dtNasc = user.dtNasc
      this.users[id].idade = user.idade
      this.users[id].estado = user.estado
      this.users[id].cidade = user.cidade
    },
  }
};
</script>
<style scoped>
  #tooltip{
    display:none;
  }
  #info:hover #tooltip{
    display: block;
  }
</style>
