import { sortByKeys } from './sort-by-keys';

interface DummyData {
    name: string;
    orderNum: number;
    count: number;
}

describe('Sort', () => {
    let initialData: DummyData[];

    beforeEach(() => {
        initialData = [
            { name: 'c', orderNum: 5, count: 3 },
            { name: 'b', orderNum: 1, count: 3 },
            { name: 'e', orderNum: 3, count: 2 },
            { name: 'd', orderNum: 4, count: 2 },
            { name: 'a', orderNum: 2, count: 4 },
        ];
    });

    it('should sort by name', () => {
        const sorted = sortByKeys<DummyData>(initialData, 'name');
        const expected: DummyData[] = [
            { name: 'a', orderNum: 2, count: 4 },
            { name: 'b', orderNum: 1, count: 3 },
            { name: 'c', orderNum: 5, count: 3 },
            { name: 'd', orderNum: 4, count: 2 },
            { name: 'e', orderNum: 3, count: 2 },
        ];
        expect(sorted).toEqual(expected);
    });

    it('should sort by -count and name', () => {
        const sorted = sortByKeys<DummyData>(initialData, '-count', '-name');
        const expected: DummyData[] = [
            { name: 'a', orderNum: 2, count: 4 },
            { name: 'c', orderNum: 5, count: 3 },
            { name: 'b', orderNum: 1, count: 3 },
            { name: 'e', orderNum: 3, count: 2 },
            { name: 'd', orderNum: 4, count: 2 },
        ];
        expect(sorted).toEqual(expected);
    });

    it('should sort by count and ordernum', () => {
        const sorted = sortByKeys<DummyData>(initialData, 'count', 'orderNum');
        const expected: DummyData[] = [
            { name: 'e', orderNum: 3, count: 2 },
            { name: 'd', orderNum: 4, count: 2 },
            { name: 'b', orderNum: 1, count: 3 },
            { name: 'c', orderNum: 5, count: 3 },
            { name: 'a', orderNum: 2, count: 4 },
        ];
        expect(sorted).toEqual(expected);
    });
});
