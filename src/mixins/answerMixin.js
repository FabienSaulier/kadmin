
// Mixin object
import axios from 'axios'
import * as Toaster from '../lib/toaster'

export default {

  data() {
    return {

    }
  },
  methods: {

    save: function (answer) {
      const cleanAnswer = JSON.parse(JSON.stringify(answer))
      axios({ method: 'put', url: process.env.API_URL+'/answer/', data: cleanAnswer })
        .then(() => { // response
          this.$toasted.success(cleanAnswer.name+' enregistré', Toaster.options)
          this.clearChildForm()
          this.load()
        })
        .catch((error) => {
          const errMsg = error.response.data.message
          this.$toasted.error(errMsg, Toaster.options)
        })
    },

    deleteAnswer: function (id, name) {
      if (!window.confirm('Voulez vous supprimer '+name)) return
      const url = process.env.API_URL+'/answer/'+id
      axios.delete(url)
        .then(() => {
          this.$toasted.success('Réponse supprimée', Toaster.options)
          this.load()
        })
        .catch((error) => {
          console.log(error)
        })
    },

    addChild: function (answer) {
      // childName est un object {name, label}
      const child = this.items.filter(a => a.name === this.childName.name)
      const childLink = { _id: child[0]._id, name: this.childName.name, label: this.childLabel }
      if (!childLink.label || childLink.label === '') {
        this.$toasted.error('un label est nécessaire pour la quick reply', Toaster.options)
        return
      }
      answer.children.push(childLink)
      this.childName = ''
      this.childLabel = ''
    },

    addSibling: function (answer) {
      // siblingName est un object {name, label}
      const sibling = this.items.filter(a => a.name === this.siblingName.name)
      const siblingLink = { _id: sibling[0]._id, name: this.siblingName.name, label: this.siblingLabel }
      if (!siblingLink.label || siblingLink.label === '') {
        this.$toasted.error('un label est nécessaire pour la quick reply', Toaster.options)
        return
      }
      answer.siblings.push(siblingLink)
      this.siblingName = ''
      this.siblingLabel = ''
    },

    delChild: function (answer, child) {
      if (!window.confirm('Voulez vous supprimer le fils: '+child.name)) return
      answer.children = answer.children.filter(c => c.name !== child.name)
    },

    delSibling: function (answer, sibling) {
      if (!window.confirm('Voulez vous supprimer le sibling: '+sibling.name)) return
      answer.siblings = answer.siblings.filter(c => c.name !== sibling.name)
    },
  },
}
