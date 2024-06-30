// /**
//  * @param {number[]} difficulty
//  * @param {number[]} profit
//  * @param {number[]} worker
//  * @return {number}
//  */
// var maxProfitAssignment = function (difficulty, profit, workers) {
// 	let sum = 0;
// 	for (let i = 0; i < workers.length; i++) {
// 		let temp = [];

// 		for (let k = 0; k < difficulty.length; k++) {
// 			console.log("i :>> ", k);
// 			if (workers[i] >= difficulty[k]) {
// 				temp.push(profit[k]);
// 			}
// 		}
// 		if (temp.length) sum += Math.max(...temp);
// 	}
// 	return sum;
// };

// console.log(maxProfitAssignment([64, 88, 97], [53, 86, 89], [98, 11, 6]));

// /**
//  * Definition for singly-linked list.
//  * function ListNode(val, next) {
//  *     this.val = (val===undefined ? 0 : val)
//  *     this.next = (next===undefined ? null : next)
//  * }
//  */
// /**
//  * @param {ListNode} l1
//  * @param {ListNode} l2
//  * @return {ListNode}
//  */
// var addTwoNumbers = function (l1, l2) {
// 	let num1 = 0;
// 	let num2 = 0;
// 	let multiplyer = 1;
// 	for (let i = l1.length - 1; i >= 0; i--) {
// 		num1 += l1[i] * multiplyer;
// 		multiplyer *= 10;
// 	}
// 	multiplyer = 1;
// 	for (let i = l2.length - 1; i >= 0; i--) {
// 		num2 += l2[i] * multiplyer;
// 		multiplyer *= 10;
// 	}
// 	let sum = num1 + num2;
// 	sum = String(sum);
// 	sum = sum.split("");

// 	let output = [];
// 	for (let i = 0; i < sum.length; i++) {
// 		output.push(Number(sum[i]));
// 	}
// 	// let output = Array.from(String(sum), Number);
// 	return output.reverse();
// };

// let ll = addTwoNumbers([9, 9, 9, 9, 9, 9, 9], [9, 9, 9, 9]);
// console.log(ll);

// /**
//  * @param {number[]} nums
//  * @param {number} limit
//  * @return {number}
//  */
// var longestSubarray = function (nums, limit) {
// 	let longest = 0;
// 	for (let i = 0; i < nums.length; i++) {
// 		let arr = [];
// 		for (let j = i; j < nums.length; j++) {
// 			arr.push(nums[j]);
// 			let max = Math.max(...arr);
// 			let min = Math.min(...arr);
// 			let len = arr.length;
// 			check = Math.abs(max - min);
// 			if (check <= limit && len > longest) {
// 				longest = len;
// 			}
// 		}
// 	}
// 	return longest;
// };

// console.log("longest :>> ", longestSubarray([8, 2, 4, 7], 4));

// /**
//  * @param {number[]} nums
//  * @param {number} target
//  * @return {number[]}
//  */
// var twoSum = function (nums, target) {
// 	let output = [];
// 	for (let i = 0; i < nums.length; i++) {
// 		for (let j = i + 1; j < nums.length; j++) {
// 			const element = nums[i] + nums[j];
// 			if (element === target) {
// 				output[0] = i;
// 				output[1] = j;
// 			}
// 		}
// 	}
// 	return output;
// };

// /**
//  * @param {number[]} nums1
//  * @param {number[]} nums2
//  * @return {number}
//  */
// var findMedianSortedArrays = function (nums1, nums2) {
// 	let median = 0;
// 	let concatArr = [...nums1, ...nums2];
// 	concatArr.sort((a, b) => a - b);
// 	let len = concatArr.length;
// 	if (len % 2 !== 0) {
// 		console.log(len);
// 		let index = len / 2 - ((len / 2) % 1);
// 		console.log("index :>> ", index);
// 		median = concatArr[index];
// 	} else {
// 		let index1 = len / 2;
// 		let index2 = len / 2 - 1;
// 		median = (concatArr[index1] + concatArr[index2]) / 2;
// 	}
// 	console.log("concatArr :>> ", concatArr);
// 	console.log("median :>> ", median);
// 	// return median;
// };

// findMedianSortedArrays([3], [-1, -2]);

// /**
//  * @param {number[]} nums
//  * @param {number} k
//  * @return {number}
//  */
// var minKBitFlips = function (nums, k) {
// 	let steps = 0;
// 	for (let i = 0; i < nums.length; i++) {
// 		if (nums[i] === 0 && i + k <= nums.length) {
// 			steps++;
// 			for (let j = 0; j < k; j++) {
// 				let element = nums[i + j];
// 				nums[i + j] = element > 0 ? 0 : 1;
// 			}
// 		}
// 	}
// 	if (nums.includes(0)) {
// 		return -1;
// 	}
// 	return steps;
// };

// minKBitFlips([1, 1, 0], 2);

// class TreeNode {
// 	constructor(value) {
// 		this.value = value;
// 		this.left = null;
// 		this.right = null;
// 	}
// }

// class BinarySearchTree {
// 	constructor() {
// 		this.root = null;
// 	}

// 	insert(value) {
// 		const newNode = new TreeNode(value);

// 		if (this.root === null) {
// 			this.root = newNode;
// 			return;
// 		}

// 		let current = this.root;
// 		while (true) {
// 			if (value < current.value) {
// 				if (current.left === null) {
// 					current.left = newNode;
// 					break;
// 				}
// 				current = current.left;
// 			} else {
// 				if (current.right === null) {
// 					current.right = newNode;
// 					break;
// 				}
// 				current = current.right;
// 			}
// 		}
// 	}
// }

// // Example usage:
// const bst = new BinarySearchTree();
// bst.insert(5);
// bst.insert(3);
// bst.insert(8);
// bst.insert(1);
// bst.insert(4);
// bst.insert(7);
// bst.insert(9);

// console.log(bst.root);

// /**
//  * @param {number[][]} edges
//  * @return {number}
//  */
// var findCenter = function (edges) {
// 	let repeated = edges[0][0];
// 	for (let i = 0; i < edges.length; i++) {
// 		const element = edges[i];
// 		if (repeated !== element[0] && repeated !== element[1]) {
// 			i--;
// 			repeated = edges[0][1];
// 		}
// 	}
// 	return repeated;
// };

// console.log(
// 	findCenter([
// 		[1, 2],
// 		[2, 3],
// 		[4, 2],
// 	])
// );

// /**
//  * @param {number} n
//  * @param {number[][]} roads
//  * @return {number}
//  */
// var maximumImportance = function (n, roads) {
// 	let importance = new Array(n).fill(0);

// 	let obj = importance.map((element, index) => {
// 		return { index: index, reapeted: 0 };
// 	});

// 	for (let [a, b] of roads) {
// 		obj[a].reapeted++;
// 		obj[b].reapeted++;
// 	}
// 	console.log("omportance :>> ", obj);

// 	let output = 0;
// 	obj.sort((a, b) => a.reapeted - b.reapeted);
// 	for (let i = 0; i < n; i++) {
// 		obj[i].index = i + 1;
// 		output += obj[i].index * obj[i].reapeted;
// 	}

// 	return output;
// };

// maximumImportance(5, [
// 	[0, 1],
// 	[1, 2],
// 	[2, 3],
// 	[0, 2],
// 	[1, 3],
// 	[2, 4],
// ]);

// /**
//  * @param {number} n
//  * @param {number[][]} edges
//  * @return {number[][]}
//  */
// var getAncestors = function (n, edges) {
// 	// Initialize output array to store ancestors
// 	let output = Array.from({ length: n }, () => []);

// 	// Iterate through each edge
// 	for (let [parent, child] of edges) {
// 		output[child].push(parent); // Store parent as ancestor of child
// 		// Append ancestors of parent to child's ancestors
// 		output[child].push(...output[parent]);
// 	}

// 	// Remove duplicates from each array and sort them
// 	for (let i = 0; i < n; i++) {
// 		output[i] = [...new Set(output[i])].sort((a, b) => a - b);
// 	}

// 	// Log or return the output array
// 	return output;
// };

// getAncestors(8, [
// 	[0, 3],
// 	[0, 4],
// 	[1, 3],
// 	[2, 4],
// 	[2, 7],
// 	[3, 5],
// 	[3, 6],
// 	[3, 7],
// 	[4, 6],
// ]);
