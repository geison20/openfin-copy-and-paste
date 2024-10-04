/**
 * Extracts a unique list of all members, administrators, and owners from the provided groups,
 * removing any null, undefined, or duplicate values.
 * 
 * @param {Array} data - An array of `Group` objects, where each `Group` must have
 *                       the properties `members`, `admins`, and `owner`.
 *                       `members` and `admins` can be arrays of IDs or empty,
 *                       and `owner` is a single ID.
 * @returns {Array} - Returns an array of unique, defined IDs of members, administrators,
 *                    and owners from the groups, without duplicates or null/undefined values.
 * 
 * @example
 * // Example input
 * const groups = [
 *   { members: [1, 2], admins: [2], owner: 3 },
 *   { members: [4, 5], admins: [], owner: 6 },
 *   { members: null, admins: [7, 8], owner: undefined }
 * ];
 * 
 * // Function call
 * const uniqueMembers = allMembers(groups);
 * 
 * // Expected output
 * // uniqueMembers would be [1, 2, 3, 4, 5, 6, 7, 8]
 * 
 * @note
 * The function assumes that the input `data` is always an array. If `data` is not an array,
 * the function returns an empty array. The function uses `Array.prototype.flat()` and `Array.prototype.filter(Boolean)`
 * to flatten and filter the input array, respectively, ensuring that only valid
 * and unique values are included in the final array.
 */
const allMembers = isArray(data) 
  ? data.reduce((acc, group) => {
      acc.push(...[group.members, group.admins, group.owner].flat().filter(Boolean));
      return acc;
    }, [])
  : [];

const uniqueMembers = Array.from(new Set(allMembers)).filter(Boolean);