import { Component, Vue , Prop, Emit, Watch} from 'vue-property-decorator';
import {ITodo} from '../types/todo';
// Vue.extend
@Component
export default class TodoItem extends Vue {
    public i: number  = 1;
    @Prop(Object) public item !: ITodo; // 强制认为是对象类型
    @Prop(Number) public index!: number;
    @Emit('say')
    public say1() {
        return 'hello';
    }
    @Watch('i')
    public fn() {
        console.log('i变化了');
    }
    public increment() {
        this.i += 1;
    }
     protected render() {
        return <h1>{this.item.text} <button on-click={this.say1}>触发方法</button>
        {this.i}
        <button on-click={this.increment}></button>
        </h1>;
    }
}
